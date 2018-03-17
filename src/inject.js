const CONTENT_SCRIPT_PATH = 'src/content.js'
const POST_MESSAGE_SIGNATURE = 'teachableDebugger'
const RUNTIME_MESSAGE_SIGNATURE = 'requestSchoolData'

const RETRY_INTERVAL = 100
const TIMEOUT = 3000

class Injector {
  constructor() {
    this.handleChromeRuntimeMessage = this.handleChromeRuntimeMessage.bind(this)

    this.subscribeToEvents()
    this.injectContentScript()
  }

  handleChromeRuntimeMessage(request, sender, sendResponse) {
    // Don't do the work if we don't have to.
    if (this._invalidWebpage) {
      sendResponse({
        error: 'Not a Teachable school.',
      })

      return
    }

    if (!this._tries) {
      this._tries = 1
    } else {
      this._tries++
    }

    // Race condition handling: if the active tab hasn't yet sent data about the
    // school, let's retry a few times before giving up.
    if (!this.activeTabData) {
      if (this._tries * RETRY_INTERVAL < TIMEOUT) {
        setTimeout(() => {
          this.handleChromeRuntimeMessage(request, sender, sendResponse)
        }, RETRY_INTERVAL)
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

    $script.setAttribute(
      'src',
      chrome.extension.getURL(CONTENT_SCRIPT_PATH)
    )

    document.body.appendChild($script)
  }

  subscribeToEvents() {
    addEventListener('message', (msg) => {
      if (msg.data.error) {
        this._invalidWebpage = true
      } else if (msg.data.source === POST_MESSAGE_SIGNATURE) {
        this.activeTabData = msg.data.data
      }
    })

    chrome.runtime.onMessage.addListener(this.handleChromeRuntimeMessage)
  }
}

new Injector()
