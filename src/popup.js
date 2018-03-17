document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      msg: 'requestSchoolData',
    }, (res) => {
      document.body.insertAdjacentHTML('beforeend', `
        <h1>School Info</h1>
        <p>School id: <pre><code>${res.school.id}</code></pre>
        <a href="${res.school.staffLink}">View in staff app</a>

        <h1>Customizations</h1>
        <p>Has custom CSS? ${res.customizations.css ? '<strong>yes</strong>' : '<strong>no</strong>'}</p>
        ${res.customizations.css ?
          `<pre><code>${res.customizations.css}</code></pre>`
        : ''}

        <p>Has head code snippet? ${res.customizations.head ? '<strong>yes</strong>' : '<strong>no</strong>'}</p>
        ${res.customizations.head ?
          `<pre><code>${res.customizations.head}</code></pre>`
        : ''}
      `)
    });
  });
}, false);
