const fs = require('fs').promises;


async function commentsParse(fileName){

    let input = await fs.readFile(fileName, "utf8");
     
    /// parse comments from text
    const comments = input                                                                                                                                
        .split('\r\n')                                                                                    
        .map((val, i, arr)=>{
            val = val.split(':');

        /// build object structure
            return {                                                                                       
                id: i+1,
                path: val.length < 3 ? ['main'] : ['main', ...val.slice(1, val.length-1)],
                author: val[0],
                comment: val[val.length-1]
            };
        });

    /// find parent comments for items
    const parentIdFider = (items) => {
        
        items.forEach(item => {  
            if (item.path.length === 1) item.pid = null
            else {  
                    /// get parent id by comaparing paths
                    item.pid = items.find(isParentItem => {
                        
                        const itemPath = JSON.stringify(item.path.filter((el, i)=>i!=1));
                        const isParentItemPath = JSON.stringify(isParentItem.path);
                        return item.path[1] == isParentItem.author && itemPath === isParentItemPath

                }).id;
            }
        });
    }

    parentIdFider(comments);

    let output = new String();

    /// build tree structure
    const commentsTree = (items, id) => {
        
        items.forEach(item => {
            if (item.pid == id) {
               let spaces = item.path.length == 1 ? '' : ' '.repeat((item.path.length-1) * 2) + '|-';
               output += spaces + item.author + ':' + item.comment + '\r\n';
               commentsTree(items, item.id); 
            }})
        };

    commentsTree(comments, null);
    
    fs.writeFile('output.txt', output);

}

commentsParse("input.txt").catch(console.error);

