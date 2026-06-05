export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

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
          status: {
            equals: '已發布'
          }
        },
        sorts: [
          {
            property: '發布日期',
            direction: 'descending'
          }
        ]
      })
    });

    const data = await response.json();

    const posts = data.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        title: props['標題']?.title?.[0]?.plain_text || '',
        summary: props['摘要']?.rich_text?.[0]?.plain_text || '',
        mainTag: props['主標籤']?.select?.name || '',
        subTags: props['次標籤']?.multi_select?.map(t => t.name) || [],
        publishDate: props['發布日期']?.date?.start || '',
        coverImage: props['封面圖']?.url || '',
        status: props['狀態']?.status?.name || '',
      };
    });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
