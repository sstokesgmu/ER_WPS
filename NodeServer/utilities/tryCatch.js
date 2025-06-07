export default async function tryCatch(promise)
{
    try {
        const result = await promise; 
        return {data:result, error:null}
    }  catch (e) {return {data:null, e}}
}