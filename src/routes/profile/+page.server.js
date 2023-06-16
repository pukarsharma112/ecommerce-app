export async function load(event) {
  const currentUser = await event.locals.getCurrentUser();
}
