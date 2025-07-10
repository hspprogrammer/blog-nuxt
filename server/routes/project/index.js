export default defineEventHandler(async (event) => {
  const { page,category } = getRouterParams(event)
  if(category){
    const redirectUrl = `/project/${page || 1}/${encodeURIComponent(category)}`;
    await sendRedirect(event, redirectUrl, 302)
  }
  const fristcategory = await queryCollection(event, 'category').where('type', '=', 'project').first();
  const redirectUrl = `/project/${page || 1}/${encodeURIComponent(fristcategory.name)}`;
  await sendRedirect(event, redirectUrl, 302)
})