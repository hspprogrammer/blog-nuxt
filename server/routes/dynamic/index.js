export default defineEventHandler(async (event) => {
  const { page } = getRouterParams(event)
  const redirectUrl = `/dynamic/${page || 1}`;
  await sendRedirect(event, redirectUrl, 302)
})