const onode = {
    scope: {
        __onamespace, // Prints: /homepage
        __ofilepath // Prints: omodules/homepage/onode.js
    },
    childOmodules: (r => {
        return r.keys().map(key => r(key).default)
    })(require.context('./', true, /^\.\/omodules\/((?!\/)[\s\S])+\/onode\.js$/))
}

export default onode
