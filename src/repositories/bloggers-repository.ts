export let bloggers: BloggerViewModelType[] = [
    {id: 1, name: "Dimych", youtubeUrl: "https://www.youtube.com/c/ITKAMASUTRA/videos"},
    {id: 2, name: "Lenko", youtubeUrl: "https://www.youtube.com/channel/UCkgXcNSMktRtfMiv64Pxo5g/videos"},
    {id: 3, name: "Humberman", youtubeUrl: "https://www.youtube.com/c/AndrewHubermanLab/videos"},
    {id: 4, name: "Goblin", youtubeUrl: "https://www.youtube.com/c/DmitryPuchkov/videos"},
    {id: 5, name: "Yamshchikov", youtubeUrl: "https://www.youtube.com/channel/UCQMteJvING2dzFIFbBYdipw/videos"}
];

function getLastBloggerId(bloggersArray: BloggerViewModelType[]) {
    let lastIndex = 0;
    bloggersArray.forEach(bl => {
        if (bl.id > lastIndex) {
            lastIndex = bl.id;
        }
    });
    return lastIndex;
}

export const bloggersRepository = {
    findBloggers() {
        return bloggers
    },
    createBlogger(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: getLastBloggerId(bloggers) + 1,
            name: name,
            youtubeUrl: youtubeUrl
        };
        bloggers.push(newBlogger);
        return newBlogger
    },
    getBloggerById(id: number) {
        const blogger = bloggers.find(bl => bl.id === id);
        return blogger
    },
    updateBlogger(id: number, name: string, youtubeUrl: string) {
        const blogger = bloggers.find(bl => bl.id === id);
        if (!blogger) {
            return false
        } else {
            blogger.name = name;
            blogger.youtubeUrl = youtubeUrl;
            return true
        }
    },
    deleteBlogger(id: number) {
        const blogger = bloggers.find(bl => bl.id === id);
        if (!blogger) {
            return false
        } else {
            const newBloggersArray = bloggers.filter(bl => bl.id !== id);
            if (newBloggersArray.length < bloggers.length) {
                bloggers = newBloggersArray;
                return true
            }
        }
    }
};

type BloggerViewModelType = {
    id: number
    name: string
    youtubeUrl: string
}
