import Ember from 'ember';
import service from 'ember-service/inject';
import computed, { reads, not } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

import layout from '../templates/components/nypr-player';

export default Ember.Component.extend({
  layout,
  hifi                  : service(),
  classNames            : ['nypr-player'],
  classNameBindings     : ['isAudiostream'],

  isReady               : reads('hifi.isReady'),
  isPlaying             : reads('hifi.isPlaying'),
  isLoading             : reads('hifi.isLoading'),
  isAudiostream         : reads('hifi.isStream'),

  // Notification
  didDismiss            : false,
  didNotDismiss         : not('didDismiss'),
  displayNotificationBar: computed.and('didNotDismiss', 'revealNotificationBar'),

  currentTitle          : null,

  playState             : computed('isPlaying', 'isLoading', function() {
    if (get(this, 'isLoading')) {
      return 'is-loading';
    } else if (get(this, 'isPlaying')) {
      return 'is-playing';
    } else {
      return 'is-paused';
    }
  }),

  actions: {
    playOrPause() {
      if (get(this, 'isPlaying')) {
        this.sendAction('onPause');
        get(this, 'hifi').togglePause();
      } else {
        this.sendAction('onPlay');
        get(this, 'hifi').togglePause();
      }
    },
    dismissNotification() {
      this.sendAction('onDismissNotification');
      set(this, 'didDismiss', true);
    },
    setPosition(p) {
      get(this, 'hifi').set('position', (p * get(this, 'hifi.currentSound.duration')));
    },
    rewind() {
      get(this, 'hifi').rewind(15000);
    },
    fastForward() {
      get(this, 'hifi').fastForward(15000);
    },
    setVolume(vol) {
      get(this, 'hifi').set('volume', vol);
    },
    toggleMute() {
      get(this, 'hifi').toggleMute();
    },
  }
});
