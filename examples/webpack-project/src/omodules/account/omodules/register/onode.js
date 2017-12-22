const onode = {
    scope: {
        __onamespace, // Prints: /account/register
        __ofilepath // Prints: omodules/account/omodules/register/onode.js
    },
    childOmodules: (r => {
        return r.keys().map(key => r(key).default)
    })(require.context('./', true, /^\.\/omodules\/((?!\/)[\s\S])+\/onode\.js$/))
}

export default onode
