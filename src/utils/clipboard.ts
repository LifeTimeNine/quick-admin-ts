import ClipboardJs from 'clipboard'

class Clipboard extends ClipboardJs {
  /** 复制文本 */
  public static copyText(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fakeElement = document.createElement('button')

      const clipboard = new Clipboard(fakeElement, {
        text: () => text,
        action: () => 'copy',
        container: document.body
      }).on('success', () => {
        clipboard.destroy()
        resolve()
      }).on('error', e => {
        clipboard.destroy()
        reject(e)
      })

      document.body.append(fakeElement)
      fakeElement.click()
      document.body.removeChild(fakeElement)
    })
  }
}

export default Clipboard
