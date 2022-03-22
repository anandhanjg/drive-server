const { getClientIp,cors } = require("./common.middleware");
const { parseBody } = require("./parser.middleware");

module.exports.setMiddlewares=(app,express)=>{
    app.use(cors);
    app.use(parseBody);

    app.set('views','./views');
    app.set('view engine','ejs');

    app.use(getClientIp);

    app.use(express.static('./public'));
    app.use(express.static('./uploads'));
    // app.use(express.raw({limit:"10mb"}));
    // app.use(express.json({limit:"10mb"}))
}