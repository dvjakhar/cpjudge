function getLastPage(count){
    return Math.ceil(count / 10);
}

module.exports = getLastPage;