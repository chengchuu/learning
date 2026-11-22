self.onmessage = e => {
    console.log(e)
    self.postMessage(`I receive ur message: ${e.data}`)
}