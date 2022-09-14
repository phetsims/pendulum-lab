// Copyright 2014-2022, University of Colorado Boulder

/**
 * Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import energyScreenIcon_png from '../../mipmaps/energyScreenIcon_png.js';
import PendulumLabConstants from '../common/PendulumLabConstants.js';
import pendulumLab from '../pendulumLab.js';
import PendulumLabStrings from '../PendulumLabStrings.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

class EnergyScreen extends Screen {
  constructor() {

    const options = {
      name: PendulumLabStrings.screen.energyStringProperty,
      backgroundColorProperty: new Property( PendulumLabConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( energyScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new EnergyModel(),
      model => new EnergyScreenView( model ),
      options
    );
  }
}

pendulumLab.register( 'EnergyScreen', EnergyScreen );
export default EnergyScreen;