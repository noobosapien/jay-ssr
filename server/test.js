const path = require('path');
const fs = require('fs/promises');

(async () => {
    try{
        const data = await fs.readFile(path.resolve('../build/_index.html'), 'utf8');

        await data.replace(
            '<div id="root"></div>',
            `<div id="root">
                html
            )}</div>`);
    
        await data.replace(
        '<style id="jss-server-side"></style>',
        `<style id="jss-server-side">
            css
        )}</style>`);

        console.log(data);
    }catch(e){
        console.log(e);
    }
})();