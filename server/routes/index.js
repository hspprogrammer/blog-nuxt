export default defineEventHandler(async (event) => {
  const { page,category } = getRouterParams(event)
  if(category){
    const redirectUrl = `/article/${page || 1}/${encodeURIComponent(category)}`;
    await sendRedirect(event, redirectUrl, 302)
  }
  const fristcategory = await queryCollection(event, 'category').where('type', '=', 'article').first();
  const redirectUrl = `/article/${page || 1}/${encodeURIComponent(fristcategory.name)}`;
  await sendRedirect(event, redirectUrl, 302)
})