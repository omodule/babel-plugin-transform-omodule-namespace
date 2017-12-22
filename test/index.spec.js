import { transformFileSync } from 'babel-core'
import path from 'path'

const pluginPath = path.join(__dirname, '../lib/index.js')

const emptyOptions = {
    plugins: [pluginPath]
}

const withRootPath = {
    plugins: [
        [
            pluginPath,
            {
                rootPath: path.join(__dirname, './test-case/root')
            }
        ]
    ]
}

const prefix = '/omm'

const withNamespacePrefix = {
    plugins: [
        [
            pluginPath,
            {
                namespacePrefix: prefix,
                rootPath: path.join(__dirname, './test-case/root')
            }
        ]
    ]
}

test('emptyOptions', () => {
    global.omoduleScope = undefined
    eval(
        transformFileSync(
            path.join(
                __dirname,
                './test-case/root/omodules/child1/omodules/grandchild1/folder/index.js'
            ),
            emptyOptions
        ).code
    )
    expect(global.omoduleScope).toEqual({
        __onamespace: '/',
        __ofilepath: 'test/test-case/root/omodules/child1/omodules/grandchild1/folder/index.js'
    })
    global.omoduleScope = undefined
})

test('withRootPath', () => {
    global.omoduleScope = undefined
    expect(function() {
        eval(
            transformFileSync(path.join(__dirname, './test-case/outOfRootPath.js'), withRootPath)
                .code
        )
    }).toThrow()

    eval(
        transformFileSync(path.join(__dirname, './test-case/root/folder/index.js'), withRootPath)
            .code
    )
    expect(global.omoduleScope).toEqual({
        __onamespace: '/',
        __ofilepath: 'folder/index.js'
    })

    eval(
        transformFileSync(
            path.join(__dirname, './test-case/root/omodules/child2/folder/index.js'),
            withRootPath
        ).code
    )
    expect(global.omoduleScope).toEqual({
        __onamespace: '/child2',
        __ofilepath: 'omodules/child2/folder/index.js'
    })

    eval(
        transformFileSync(
            path.join(__dirname, './test-case/root/omodules/child1/omodules/grandchild2/index.js'),
            withRootPath
        ).code
    )
    expect(global.omoduleScope).toEqual({
        __onamespace: '/child1/grandchild2',
        __ofilepath: 'omodules/child1/omodules/grandchild2/index.js'
    })

    global.omoduleScope = undefined
})
test('withNamespacePrefix', () => {
    global.omoduleScope = undefined

    expect(function() {
        eval(
            transformFileSync(path.join(__dirname, './test-case/outOfRootPath.js'), withRootPath)
                .code
        )
    }).toThrow()

    eval(
        transformFileSync(
            path.join(__dirname, './test-case/root/folder/index.js'),
            withNamespacePrefix
        ).code
    )
    expect(global.omoduleScope).toEqual({
        __onamespace: prefix,
        __ofilepath: 'folder/index.js'
    })

    eval(
        transformFileSync(
            path.join(__dirname, './test-case/root/omodules/child1/omodules/grandchild2/index.js'),
            withNamespacePrefix
        ).code
    )
    expect(global.omoduleScope).toEqual({
        __onamespace: prefix + '/child1/grandchild2',
        __ofilepath: 'omodules/child1/omodules/grandchild2/index.js'
    })

    eval(
        transformFileSync(
            path.join(__dirname, './test-case/root/omodules/child1/omodules/grandchild1/folder/index.js'),
            withNamespacePrefix
        ).code
    )
    expect(global.omoduleScope).toEqual({
        __onamespace: prefix + '/child1/grandchild1',
        __ofilepath: 'omodules/child1/omodules/grandchild1/folder/index.js'
    })

    global.omoduleScope = undefined
})
