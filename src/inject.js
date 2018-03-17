/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, node) {
  const $script = document.createElement('script');
  $script.setAttribute('type', 'text/javascript');
  $script.setAttribute('src', file_path);
  node.appendChild($script);
}

injectScript(chrome.extension.getURL('src/content.js'), document.body);

// For now let's just trust the order of operations. But it is know this will be
// prone to breaking in the future if the popup requests the data before the
// content script sends school data to the inject.
let hasInitialized = false
addEventListener('message', (msg) => {
  if (hasInitialized) {
    return
  }

  hasInitialized = true

  let data = msg.data

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg === 'requestSchoolData') {
      sendResponse(data)
    }
  })
})
