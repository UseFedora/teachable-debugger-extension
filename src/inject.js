const POST_MESSAGE_SIGNATURE = 'teachableDebugger'
const RUNTIME_MESSAGE_SIGNATURE = 'requestSchoolData'
const TIMEOUT = 3000

class Injector {
  constructor() {
    this.handleChromeRuntimeMessage = this.handleChromeRuntimeMessage.bind(this)

    this.subscribeToEvents()
    this.injectContentScript()
  }

  handleChromeRuntimeMessage(request, sender, sendResponse) {
    if (!this._tries) {
      this._tries = 1
    } else {
      this._tries++
    }

    // Race condition handling: if the active tab hasn't yet sent data about the
    // school, let's retry a few times before giving up.
    if (!this.activeTabData) {
      if (this._tries * 100 < TIMEOUT) {
        setTimeout(() => {
          this.handleChromeRuntimeMessage(request, sender, sendResponse)
        }, 100)
      } else {
        console.log('Could not receive data from Teachable school.')
      }

      return
    }

    if (request.msg === RUNTIME_MESSAGE_SIGNATURE) {
      sendResponse(this.activeTabData)
    }
  }

  injectContentScript() {
    const $script = document.createElement('script')

    $script.setAttribute('src', chrome.extension.getURL('src/content.js'))

    document.body.appendChild($script)
  }

  subscribeToEvents() {
    addEventListener('message', (msg) => {
      if (msg.data.source === POST_MESSAGE_SIGNATURE) {
        this.activeTabData = msg.data.data
      }
    })

    chrome.runtime.onMessage.addListener(this.handleChromeRuntimeMessage)
  }
}

new Injector()
