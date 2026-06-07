const NOTION_TOKEN = process.env.NOTION_TOKEN;
const WORKS_DATABASE_ID = process.env.NOTION_WORKS_DATABASE_ID;

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function richTextToHtml(richText = []) {
  return richText.map(rt => {
    let text = escapeHtml(rt.plain_text || '');
    const ann = rt.annotations || {};
    if (ann.code) text = `<code>${text}</code>`;
    if (ann.bold) text = `<strong>${text}</strong>`;
    if (ann.italic) text = `<em>${text}</em>`;
    if (ann.strikethrough) text = `<del>${text}</del>`;
    if (ann.underline) text = `<u>${text}</u>`;
    if (rt.href) text = `<a href="${rt.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    return text;
  }).join('');
}

async function fetchBlockChildren(blockId) {
  let blocks = [];
  let cursor;
  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    url.searchParams.set('page_size', '100');
    if (cursor) url.searchParams.set('start_cursor', cursor);

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      }
    });
    const data = await res.json();
    blocks = blocks.concat(data.results || []);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return blocks;
}

async function blocksToHtml(blocks) {
  const htmlParts = [];
  let listBuffer = [];
  let listType = null;

  const flushList = () => {
    if (listBuffer.length) {
      htmlParts.push(`<${listType}>${listBuffer.join('')}</${listType}>`);
      listBuffer = [];
      listType = null;
    }
  };

  for (const block of blocks) {
    const type = block.type;
    const value = block[type] || {};
    const text = richTextToHtml(value.rich_text);

    let childrenHtml = '';
    if (block.has_children) {
      const children = await fetchBlockChildren(block.id);
      childrenHtml = await blocksToHtml(children);
    }

    if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const tag = type === 'bulleted_list_item' ? 'ul' : 'ol';
      if (listType !== tag) {
        flushList();
        listType = tag;
      }
      listBuffer.push(`<li>${text}${childrenHtml}</li>`);
      continue;
    }

    flushList();

    switch (type) {
      case 'paragraph':
        htmlParts.push(`<p>${text}</p>${childrenHtml}`);
        break;
      case 'heading_1':
        htmlParts.push(`<h1>${text}</h1>`);
        break;
      case 'heading_2':
        htmlParts.push(`<h2>${text}</h2>`);
        break;
      case 'heading_3':
        htmlParts.push(`<h3>${text}</h3>`);
        break;
      case 'quote':
        htmlParts.push(`<blockquote>${text}${childrenHtml}</blockquote>`);
        break;
      case 'code':
        htmlParts.push(`<pre><code>${escapeHtml((value.rich_text || []).map(rt => rt.plain_text).join(''))}</code></pre>`);
        break;
      case 'image': {
        const src = value.type === 'external' ? value.external?.url : value.file?.url;
        const caption = richTextToHtml(value.caption);
        htmlParts.push(`<figure><img src="${src}" alt="${caption.replace(/<[^>]+>/g, '')}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`);
        break;
      }
      case 'video': {
        const src = value.type === 'external' ? value.external?.url : value.file?.url;
        const ytMatch = src && src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
        const vimeoMatch = src && src.match(/vimeo\.com\/(\d+)/);
        if (ytMatch) {
          htmlParts.push(`<div class="video-embed"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`);
        } else if (vimeoMatch) {
          htmlParts.push(`<div class="video-embed"><iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`);
        } else if (src) {
          htmlParts.push(`<div class="video-embed"><video src="${src}" controls playsinline></video></div>`);
        }
        break;
      }
      case 'embed':
      case 'bookmark':
      case 'link_preview': {
        const src = value.url;
        if (src) {
          const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
          const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
          if (ytMatch) {
            htmlParts.push(`<div class="video-embed"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`);
          } else if (vimeoMatch) {
            htmlParts.push(`<div class="video-embed"><iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`);
          } else {
            htmlParts.push(`<a class="link-embed" href="${src}" target="_blank" rel="noopener noreferrer">${escapeHtml(src)}</a>`);
          }
        }
        break;
      }
      case 'divider':
        htmlParts.push('<hr />');
        break;
      case 'to_do': {
        const checked = value.checked ? 'checked' : '';
        htmlParts.push(`<p><input type="checkbox" disabled ${checked} /> ${text}</p>`);
        break;
      }
      case 'callout':
        htmlParts.push(`<div class="callout">${text}${childrenHtml}</div>`);
        break;
      default:
        if (text) htmlParts.push(`<p>${text}</p>`);
        break;
    }
  }

  flushList();
  return htmlParts.join('');
}

async function getWorkContent(pageId) {
  const blocks = await fetchBlockChildren(pageId);
  return blocksToHtml(blocks);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { id } = req.query || {};

  try {
    if (id) {
      const content = await getWorkContent(id);
      res.status(200).json({ id, content });
      return;
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${WORKS_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: '狀態',
          status: {
            equals: '已發布'
          }
        },
        sorts: [
          {
            property: '年份',
            direction: 'descending'
          }
        ]
      })
    });

    const data = await response.json();

    const works = (data.results || []).map(page => {
      const props = page.properties;
      return {
        id: page.id,
        title: props['專案名稱']?.title?.[0]?.plain_text || '',
        category: props['類別']?.select?.name || '',
        subTags: props['次標籤']?.multi_select?.map(t => t.name) || [],
        year: props['年份']?.rich_text?.[0]?.plain_text || '',
        coverImage: props['封面圖']?.url || '',
        descriptionZh: props['說明_zh']?.rich_text?.[0]?.plain_text || '',
        descriptionEn: props['說明_en']?.rich_text?.[0]?.plain_text || '',
        status: props['狀態']?.status?.name || '',
      };
    });

    res.status(200).json({ works });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
