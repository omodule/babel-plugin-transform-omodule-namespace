import path from 'path'
import fs from 'fs'
import appRoot from 'app-root-path'

const projectRootPath = appRoot.path
const OMODULE_CHILDREN_FOLDERNAME = 'omodules'
const SEPARATOR = '/'

function isAbsolutePath(p) {
    return path.isAbsolute(p)
}

function createAbsolutePath(p) {
    if (isAbsolutePath(p)) {
        return path.normalize(p)
    } else {
        return path.normalize(path.join(projectRootPath, p))
    }
}

function getFolderName(p) {
    return path.join(p, '..')
}

function getONamesapce(matchRootPath, absoluteFilename, namespacePrefix) {
    let onamespace
    if (matchRootPath === getFolderName(absoluteFilename)) {
        onamespace = namespacePrefix + '/'
    } else {
        const subPath = absoluteFilename.replace(matchRootPath, '')
        const onamespaceResult = subPath
            .split(`${path.sep}${OMODULE_CHILDREN_FOLDERNAME}${path.sep}`)
            .reduce(
                (acc, curr) => {
                    if (acc.done) {
                        return { ...acc }
                    }

                    if (curr) {
                        if (curr.indexOf(path.sep) > -1) {
                            const onamespace = acc.onamespace + curr.split(path.sep)[0] + '/'
                            return {
                                onamespace,
                                done: true
                            }
                        } else {
                            return { ...acc, ...{ onamespace: acc.onamespace + curr + '/' } }
                        }
                    } else {
                        return { ...acc, ...{ onamespace: '/' } }
                    }
                },
                {
                    onamespace: '',
                    done: false
                }
            )
        onamespace = namespacePrefix + onamespaceResult.onamespace
    }
    return onamespace.length > 1 ? onamespace.replace(/\/$/, '') : onamespace
}
function getOFilePath(matchRootPath, absoluteFilename) {
    return absoluteFilename.replace(matchRootPath + path.sep, '')
}

let done__onamespace = false
let done__ofilepath = false

export default function({ types: t }) {

    return {
        visitor: {
            Program: {
                enter() {
                    done__onamespace = false
                    done__ofilepath = false
                }
            },
            Identifier: (babelPath, state) => {
                const { rootPath, namespacePrefix = '' } = state.opts
                let absoluteRootPath
                if (rootPath) {
                    if (typeof rootPath === 'string') {
                        absoluteRootPath = createAbsolutePath(rootPath)
                    } else {
                        throw new Error('rootPath must be a string. Received ' + typeof rootPath)
                    }
                } else {
                    absoluteRootPath = projectRootPath
                }

                const absoluteFilename = createAbsolutePath(state.file.opts.filename)

                const matchRootPath = path.normalize(absoluteRootPath).replace(/[\\\/]+$/, '')

                if (absoluteFilename.indexOf(absoluteRootPath) > -1) {
                    if (babelPath.node.name === '__onamespace' && !done__onamespace) {
                        const s = getONamesapce(matchRootPath, absoluteFilename, namespacePrefix)
                        const prog = babelPath.find(path => path.isProgram())
                        const ident = t.identifier('__onamespace')
                        const string = t.stringLiteral(s)
                        const declarator = t.variableDeclarator(ident, string)
                        const declaration = t.variableDeclaration('var', [declarator])
                        prog.scope.block.body.unshift(declaration)
                        done__onamespace = true
                    }
                    if (babelPath.node.name === '__ofilepath' && !done__ofilepath) {
                        const s = getOFilePath(matchRootPath, absoluteFilename)
                        const prog = babelPath.find(path => path.isProgram())
                        const ident = t.identifier('__ofilepath')
                        const string = t.stringLiteral(s)
                        const declarator = t.variableDeclarator(ident, string)
                        const declaration = t.variableDeclaration('var', [declarator])
                        prog.scope.block.body.unshift(declaration)
                        done__ofilepath = true
                    }
                }
            }
        }
    }
}
