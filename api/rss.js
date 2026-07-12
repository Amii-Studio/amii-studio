const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const SITE_URL = 'https://www.amiistudio.com';

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: '狀態',
          status: { equals: '已發布' }
        },
        sorts: [{ property: '發布日期', direction: 'descending' }],
        page_size: 20,
      })
    });

    const data = await response.json();

    const items = data.results.map(page => {
      const props = page.properties;
      const title = props['標題']?.title?.[0]?.plain_text || '';
      const summary = props['摘要']?.rich_text?.[0]?.plain_text || '';
      const publishDate = props['發布日期']?.date?.start || '';
      const coverImage = props['封面圖']?.url || '';
      const id = page.id;
      const link = `${SITE_URL}/blog.html?id=${id}`;
      const pubDate = publishDate ? new Date(publishDate).toUTCString() : '';

      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(id)}</guid>
      <description>${escapeXml(summary)}</description>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
      ${coverImage ? `<enclosure url="${escapeXml(coverImage)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Design Lens f/1.21</title>
    <link>${SITE_URL}/blog.html</link>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml" />
    <description>設計觀點、美感生活與展覽紀錄</description>
    <language>zh-TW</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
