# serve this directory except for some files
# in the same directory as this script

from http.server import HTTPServer, BaseHTTPRequestHandler
    
class handler(BaseHTTPRequestHandler):
    # serve all the index.html, script.js, and style.css files
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        try:
            # check if the file exists
            f = open(self.path[1:]).read()
            self.send_response(200)
        except:
            # file does not exist, return 404
            f = 'file not found'
            self.send_response(404)
        self.end_headers()
        self.wfile.write(bytes(f, 'utf-8'))
        

def main():
    server = HTTPServer(('192.168.6.254', 8000), handler) 
    # server = HTTPServer(('127.0.0.1', 5500), handler)
    print('Starting server, use <Ctrl-C> to stop')
    server.serve_forever()

if "__main__" == __name__:
    main()