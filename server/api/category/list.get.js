export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if(!query.type) return {
    code:1,
    msg:'缺少参数type'
  }
  const page = await queryCollection(event, 'category')
  .where('type', '=', query.type).All()
  return {
    code:0,
    data:page,
    msg:'缺少参数type'
  }
})