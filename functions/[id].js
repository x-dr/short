/**
 * @param {string} slug
 */
import page404 from './404.html'

export async function onRequestGet(context) {
    const { request, env, params } = context;
    // const url = new URL(request.url);
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP");
    const userAgent = request.headers.get("user-agent");
    const Referer = request.headers.get('Referer') || "Referer"
    const originurl = new URL(request.url);
    const options = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timedata = new Date();
    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);

    const slug = params.id;

    const Url = await env.DB.prepare(`SELECT url FROM links where slug = '${slug}'`).first()

    if (!Url) {
        return new Response(page404, {
            status: 404,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            }
        });
    } else {
        try {
            const info = await env.DB.prepare(`INSERT INTO logs (url, slug, ip,referer,  ua, create_time) 
            VALUES ('${Url.url}', '${slug}', '${clientIP}','${Referer}', '${userAgent}', '${formattedDate}')`).run()
            // console.log(info);
            return Response.redirect(Url.url, 302);
            
        } catch (error) {
            console.log(error);
            return Response.redirect(Url.url, 302);
        }
    }

}