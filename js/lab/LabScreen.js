// Copyright 2014-2022, University of Colorado Boulder

/**
 * Lab screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import labNavbarIcon_png from '../../mipmaps/labNavbarIcon_png.js';
import labScreenIcon_png from '../../mipmaps/labScreenIcon_png.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import pendulumLab from '../pendulumLab.js';
import PendulumLabStrings from '../PendulumLabStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {
  constructor() {

    const options = {
      name: PendulumLabStrings.screen.labStringProperty,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( labScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( labNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new LabModel(),
      model => new LabScreenView( model ),
      options
    );
  }
}

pendulumLab.register( 'LabScreen', LabScreen );
export default LabScreen;