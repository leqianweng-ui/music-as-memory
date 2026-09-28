const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if(!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.stat(file, (err, stat) => {
    if(err) { res.writeHead(404).end('Not found'); return; }
    if(!stat.isFile()) { res.writeHead(404).end(); return; }
    const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.mp4':'video/mp4','.mp3':'audio/mpeg','.json':'application/json'};
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
    let start=0, end=stat.size-1;
    if(req.headers.range) {
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match || (!match[1] && !match[2])) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end(); return; }
      start=match[1] ? Number(match[1]) : Math.max(0,stat.size-Number(match[2]));
      end=match[1] && match[2] ? Math.min(Number(match[2]),end) : end;
      if(start>end || start>=stat.size) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end(); return; }
      headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(req.headers.range ? 206 : 200,headers);
    if(req.method==='HEAD') { res.end(); return; }
    const stream=fs.createReadStream(file,{start,end}); stream.on('error',()=>res.destroy()); res.on('close',()=>stream.destroy()); stream.pipe(res);
  });
}).listen(4173, '127.0.0.1', () => console.log('Music as Memory: http://localhost:4173'));
