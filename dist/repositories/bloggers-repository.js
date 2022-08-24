"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloggersRepository = exports.bloggers = void 0;
exports.bloggers = [
    { id: 1, name: "Dimych", youtubeUrl: "https://www.youtube.com/c/ITKAMASUTRA/videos" },
    { id: 2, name: "Lenko", youtubeUrl: "https://www.youtube.com/channel/UCkgXcNSMktRtfMiv64Pxo5g/videos" },
    { id: 3, name: "Humberman", youtubeUrl: "https://www.youtube.com/c/AndrewHubermanLab/videos" },
    { id: 4, name: "Goblin", youtubeUrl: "https://www.youtube.com/c/DmitryPuchkov/videos" },
    { id: 5, name: "Yamshchikov", youtubeUrl: "https://www.youtube.com/channel/UCQMteJvING2dzFIFbBYdipw/videos" }
];
function getLastBloggerId(bloggersArray) {
    let lastIndex = 0;
    bloggersArray.forEach(bl => {
        if (bl.id > lastIndex) {
            lastIndex = bl.id;
        }
    });
    return lastIndex;
}
exports.bloggersRepository = {
    findBloggers() {
        return exports.bloggers;
    },
    createBlogger(name, youtubeUrl) {
        const newBlogger = {
            id: getLastBloggerId(exports.bloggers) + 1,
            name: name,
            youtubeUrl: youtubeUrl
        };
        exports.bloggers.push(newBlogger);
        return newBlogger;
    },
    getBloggerById(id) {
        const blogger = exports.bloggers.find(bl => bl.id === id);
        return blogger;
    },
    updateBlogger(id, name, youtubeUrl) {
        const blogger = exports.bloggers.find(bl => bl.id === id);
        if (!blogger) {
            return false;
        }
        else {
            blogger.name = name;
            blogger.youtubeUrl = youtubeUrl;
            return true;
        }
    },
    deleteBlogger(id) {
        const blogger = exports.bloggers.find(bl => bl.id === id);
        if (!blogger) {
            return false;
        }
        else {
            const newBloggersArray = exports.bloggers.filter(bl => bl.id !== id);
            if (newBloggersArray.length < exports.bloggers.length) {
                exports.bloggers = newBloggersArray;
                return true;
            }
        }
    }
};
//# sourceMappingURL=bloggers-repository.js.map