
const asyncLoadScript = function(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptElement = document.getElementById(src)
    if (!scriptElement) {
      const script = document.createElement('script')
      script.src = src
      script.id = src
      script.onload = function() {
        this.onload = this.onerror = null
        resolve()
      }
      script.onerror = function(e) {
        this.onload = this.onerror = null
        reject(e)
      }
      document.body.appendChild(script)
    } else {
      resolve()
    }
  })
}

export default asyncLoadScript
