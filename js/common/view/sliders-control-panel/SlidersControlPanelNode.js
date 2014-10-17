// Copyright 2002-2014, University of Colorado Boulder

/**
 * Control panel node for pendulums system options in 'Pendulum Lab' simulation.
 * Contains length and mass sliders for pendulums, friction slider and gravity slider and dropdown menu.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var GravitySliderWithListNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/GravitySliderWithListNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumOptionSliderNode = require( 'PENDULUM_LAB/common/view/sliders-control-panel/PendulumOptionSliderNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var pattern_0lengthValue_lengthUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0lengthValue.lengthUnitsMetric' );
  var pattern_0massValue_massUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0massValue.massUnitsMetric' );
  var pattern_0propertyName_1pendulumNumber = require( 'string!PENDULUM_LAB/pattern.0propertyName.1pendulumNumber' );

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {Node} planetsListNode - Node for planets list. Should be displayed above all other layers
   * @param {Object} options for control panel node
   * @constructor
   */
  function SlidersControlPanelNode( pendulumLabModel, planetsListNode, options ) {
    var content = new VBox( {spacing: 3} ),
      pendulumSlidersNodeStorage = [],
      currentNumberOfSliders = 0;

    PanelPendulumAbstract.call( this, content, options );

    // create sliders for each pendulum and put then into storage for further adding
    pendulumLabModel.pendulumModels.forEach( function( pendulumModel, pendulumModelIndex ) {
      pendulumSlidersNodeStorage.push( new VBox( {spacing: 5, children: [
        // length slider
        new PendulumOptionSliderNode(
          pendulumModel.property( 'length' ),
          pendulumModel.lengthOptions,
          StringUtils.format( pattern_0propertyName_1pendulumNumber, 'Length', (pendulumModelIndex + 1).toString() ),
          pattern_0lengthValue_lengthUnitsMetric,
          pendulumModel.color
        ),

        // mass slider
        new PendulumOptionSliderNode(
          pendulumModel.property( 'mass' ),
          pendulumModel.massOptions,
          StringUtils.format( pattern_0propertyName_1pendulumNumber, 'Mass', (pendulumModelIndex + 1).toString() ),
          pattern_0massValue_massUnitsMetric,
          pendulumModel.color
        )
      ]} ) );
    } );

    // add gravity slider and planet list menu
    content.addChild( new GravitySliderWithListNode( pendulumLabModel.property( 'gravity' ), pendulumLabModel.gravityRange, pendulumLabModel.planetModels, planetsListNode ) );

    // add necessary pendulum sliders
    pendulumLabModel.property( 'numberOfPendulums' ).link( function( numberOfPendulums ) {
      var numberDifference = currentNumberOfSliders - numberOfPendulums;

      // remove extra sliders
      if ( numberDifference > 0 ) {
        for ( ; numberDifference--; ) {
          content.removeChildWithIndex( pendulumSlidersNodeStorage[currentNumberOfSliders - numberDifference - 1], currentNumberOfSliders - numberDifference - 1 );
          currentNumberOfSliders--;
        }
      }
      // add necessary sliders
      else if ( numberDifference < 0 ) {
        for ( ; numberDifference++; ) {
          content.insertChild( currentNumberOfSliders - numberDifference, pendulumSlidersNodeStorage[currentNumberOfSliders - numberDifference] );
          currentNumberOfSliders++;
        }
      }
    } );
  }

  return inherit( PanelPendulumAbstract, SlidersControlPanelNode );
} );