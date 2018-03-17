/**
 * @todo Figure out some way to differntiate between logged-in and general
 *       code snippets. Right now this script just grabs the first one that's
 *       on the page and we have no idea if it's logged-in or not.
 */

(function() {
  'use strict';

  function getSchoolData() {
    if (!window.school_data) {
      return undefined;
    }

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
