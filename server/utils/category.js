export async function getCategoryList(type) {
  const page = await queryCollection( 'category')
  .where('type', '=', type).All()
  return {
    code:0,
    data:page,
    msg:''
  }
}