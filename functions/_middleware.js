// Runs before every request on the Pages project.
//  - www.malindaperryconsulting.com -> 301 to the bare domain
// The link library (admin.malindaperryconsulting.com) is not part of this project:
// it is the shared LinkHub Worker (C:\amrycreations\linkhub), locked to MaLinda's family.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  if (host.startsWith("www.")) {
    url.hostname = host.slice(4);
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
