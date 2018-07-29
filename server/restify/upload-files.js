import restify from 'restify';
import os from 'os';
const PORT = 4000;
let server = restify.createServer();

server.use(restify.CORS());
server.use(restify.bodyParser({
    maxBodySize: 0,
    mapParams: true,
    mapFiles: false,
    overrideParams: false,
    multipartHandler: function (part) {
        part.on('data', function (data) {
            /* do something with the multipart data */

        });
    },
    multipartFileHandler: function (part) {
        part.on('data', function (data) {
            /* do something with the multipart file data */
            let workbook = XLXS.read(data, {WTF: true});
            let sheet_name_list = workbook.SheetNames;
            let count = 0;
            for (let i = 0; i < sheet_name_list.length; i++) {
                let customers= XLXS.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);
                let count = 0;
                customers.forEach(function (customer) {
                    console.log('line: ' + (count + 1))
                    // if(customer.newCustomerId) {
                    //     count++;
                    // }
                    count++
                });
                console.log(count);
            }
        });
    },
    keepExtensions: false,
    uploadDir: os.tmpdir(),
    multiples: true,
    hash: 'sha1'
}));

server.post('/uploads', function rm(req, res, next) {
    res.send({upload: 'upload success'});
    return next();
});

server.listen(PORT, () => {
    console.log('Restify listen on port ', PORT);
});