// Copyright 2014-2022, University of Colorado Boulder

/**
 * Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import introNavbarIcon_png from '../../mipmaps/introNavbarIcon_png.js';
import introScreenIcon_png from '../../mipmaps/introScreenIcon_png.js';
import PendulumLabModel from '../common/model/PendulumLabModel.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import PendulumLabScreenView from '../common/view/PendulumLabScreenView.js';
import pendulumLab from '../pendulumLab.js';
import PendulumLabStrings from '../PendulumLabStrings.js';

class IntroScreen extends Screen {
  constructor() {

    const options = {
      name: PendulumLabStrings.screen.introStringProperty,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( introScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( introNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new PendulumLabModel(),
      model => new PendulumLabScreenView( model ),
      options
    );
  }
}

pendulumLab.register( 'IntroScreen', IntroScreen );
export default IntroScreen;