import { expandGlob, join } from "../deps.js"
import env from "./env.js"

const build = async(config) => {
    const startTime = performance.now()

    const trying = (input, exception) => {
        return input === undefined ? exception : input
    }

    let plugin, blogDir, outputFile, confirmFile, profile

    plugin = trying(config.plugin, env.plugin)
    blogDir = trying(config.blogDir, env.blogDir)
    outputFile = trying(config.outputFile, env.outputFile)
    confirmFile = trying(config.confirmFile, env.confirmFile)
    profile = trying(config.profile, env.profile)
    
    const globCard = join(blogDir, "*" + plugin.extname)
    let posts = []

    for await (const file of expandGlob(globCard)){
        const text = await Deno.readTextFile(file.path)
        const parsed = await plugin.parse(text, profile)
        if(file.isFile){
            posts.push(parsed)
        }
    }

    const confirmId = Math.random().toString(36).slice(-8)

    const result = {
        confirmId,
        posts,
        profile
    }
    
    await Deno.writeTextFile(outputFile, JSON.stringify(result))
    await Deno.writeTextFile(confirmFile, confirmId)

    const endTime = performance.now()
    const tookTime = Math.round((endTime - startTime) * 10) / 10
    console.log(`Total in ${tookTime} ms`)
}

export default build