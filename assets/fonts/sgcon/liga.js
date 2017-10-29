/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'account_box': '&#xe851;',
            'account_circle': '&#xe853;',
            'adb': '&#xe60e;',
            'add': '&#xe145;',
            'add_a_photo': '&#xe439;',
            'add_box': '&#xe146;',
            'add_circle': '&#xe147;',
            'add_circle_outline': '&#xe3ba;',
            'control_point': '&#xe3ba;',
            'android': '&#xe859;',
            'arrow_back': '&#xe5c4;',
            'arrow_downward': '&#xe5db;',
            'arrow_drop_down': '&#xe5c5;',
            'arrow_drop_down_circle': '&#xe5c6;',
            'arrow_drop_up': '&#xe5c7;',
            'arrow_forward': '&#xe5c8;',
            'arrow_upward': '&#xe5d8;',
            'attach_file': '&#xe226;',
            'attachment': '&#xe2bc;',
            'border_color': '&#xe22b;',
            'bug_report': '&#xe868;',
            'call_to_action': '&#xe06c;',
            'cancel': '&#xe5c9;',
            'check': '&#xe5ca;',
            'check_box': '&#xe834;',
            'check_box_outline_blank': '&#xe835;',
            'check_circle': '&#xe86c;',
            'chrome_reader_mode': '&#xe86d;',
            'clear': '&#xe5cd;',
            'close': '&#xe5cd;',
            'code': '&#xe86f;',
            'content_copy': '&#xe14d;',
            'content_cut': '&#xe14e;',
            'content_paste': '&#xe14f;',
            'create_new_folder': '&#xe2cc;',
            'credit_card': '&#xe8a1;',
            'payment': '&#xe8a1;',
            'delete_forever': '&#xe959;',
            'do_not_disturb': '&#xe033;',
            'not_interested': '&#xe033;',
            'do_not_disturb_alt': '&#xe611;',
            'drafts': '&#xe151;',
            'error': '&#xe000;',
            'error_outline': '&#xe001;',
            'event': '&#xe24f;',
            'insert_invitation': '&#xe24f;',
            'event_available': '&#xe614;',
            'event_busy': '&#xe615;',
            'event_note': '&#xe616;',
            'exit_to_app': '&#xe879;',
            'file_download': '&#xe884;',
            'get_app': '&#xe884;',
            'file_upload': '&#xe2c6;',
            'find_in_page': '&#xe880;',
            'find_replace': '&#xe881;',
            'g_translate': '&#xe95a;',
            'home': '&#xe88a;',
            'import_contacts': '&#xe0e0;',
            'keyboard_arrow_down': '&#xe313;',
            'keyboard_arrow_left': '&#xe314;',
            'keyboard_arrow_right': '&#xe315;',
            'keyboard_arrow_up': '&#xe316;',
            'local_printshop': '&#xe8ad;',
            'print': '&#xe8ad;',
            'mail_outline': '&#xe0e1;',
            'map': '&#xe55b;',
            'note_add': '&#xe89c;',
            'people_outline': '&#xe7fc;',
            'perm_identity': '&#xe7ff;',
            'person_outline': '&#xe7ff;',
            'person': '&#xe7fd;',
            'person_add': '&#xe7fe;',
            'play_circle_filled': '&#xe038;',
            'public': '&#xe80b;',
            'security': '&#xe32a;',
            'sentiment_dissatisfied': '&#xe811;',
            'sentiment_neutral': '&#xe812;',
            'sentiment_satisfied': '&#xe813;',
            'sentiment_very_dissatisfied': '&#xe814;',
            'sentiment_very_satisfied': '&#xe815;',
            'settings': '&#xe8b8;',
            'subdirectory_arrow_right': '&#xe5da;',
            'subject': '&#xe8d2;',
            'subscriptions': '&#xe064;',
            'subtitles': '&#xe048;',
            'subway': '&#xe56f;',
            'verified_user': '&#xe8e8;',
            'vertical_align_bottom': '&#xe258;',
            'vertical_align_center': '&#xe259;',
            'vertical_align_top': '&#xe25a;',
            'web': '&#xe051;',
            'youtube_searched_for': '&#xe8fa;',
            'zoom_in': '&#xe8ff;',
            'zoom_out': '&#xe95b;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/sc/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
