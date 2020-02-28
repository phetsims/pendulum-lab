// Copyright 2014-2020, University of Colorado Boulder

/**
 * Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import introNavbarImage from '../../mipmaps/intro-navbar-icon_png.js';
import introScreenImage from '../../mipmaps/intro-screen-icon_png.js';
import PendulumLabModel from '../common/model/PendulumLabModel.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import PendulumLabScreenView from '../common/view/PendulumLabScreenView.js';
import pendulumLabStrings from '../pendulum-lab-strings.js';
import pendulumLab from '../pendulumLab.js';

const screenIntroString = pendulumLabStrings.screen.intro;


/**
 * @constructor
 */
function IntroScreen() {

  const options = {
    name: screenIntroString,
    backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
    homeScreenIcon: new Image( introScreenImage ),
    navigationBarIcon: new Image( introNavbarImage )
  };

  Screen.call( this,
    function() { return new PendulumLabModel(); },
    function( model ) { return new PendulumLabScreenView( model ); },
    options
  );
}

pendulumLab.register( 'IntroScreen', IntroScreen );

inherit( Screen, IntroScreen );
export default IntroScreen;