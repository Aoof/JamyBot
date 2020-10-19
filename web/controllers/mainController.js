module.exports = {
    gethome(req, res, next) {
        res.render('index', {topRightIcon: 'terminal', href: '/commands'})
    },
    getcommands(req, res, next) {
        res.render("commands", {topRightIcon: 'home', href: '/'})
    }
}