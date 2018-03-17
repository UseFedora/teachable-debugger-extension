/**
 * @todo Figure out some way to differntiate between logged-in and general
 *       code snippets. Right now this script just grabs the first one that's
 *       on the page and we have no idea if it's logged-in or not.
 */

(function() {
  'use strict';

  // We're using this as the switch to tell if we're on a Teachable school or not.
  // Can't rely on URL since we support custom URLs.
  if (!window.school_data) {
    postMessage({
      source: 'teachableDebugger',
      data: {
        error: 'Not a Teachable school.',
      },
    }, location.href);

    return;
  }

  function getSchoolData() {
    return {
      id: school_data.schoolId,
      staffLink: `https://www.teachablestaff.com/schools/${school_data.schoolId}`,
    }
  }

  function getCodeSnippetsData() {
    var $style = document.querySelector('[name="site_title"] + style');
    var $script = document.querySelector('[src*="packs/student"] + script:not([src])');

    let css, head

    if ($style && $style.innerHTML.length) {
      css = $style.innerHTML;
    }

    if ($script && $script.innerHTML.length) {
      head = $script.innerHTML;
    }

    return { css, head }
  }

  postMessage({
    source: 'teachableDebugger',
    data: {
      customizations: getCodeSnippetsData(),
      school: getSchoolData(),
    },
  }, location.href);
})();
