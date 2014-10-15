// Copyright 2002-2014, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumSlidersNode = require( 'PENDULUM_LAB/common/view/PendulumSlidersNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var pattern_0lengthValue_lengthUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0lengthValue.lengthUnitsMetric' );
  var pattern_0massValue_massUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0massValue.massUnitsMetric' );
  var pattern_0propertyName_1pendulumNumber = require( 'string!PENDULUM_LAB/pattern.0propertyName.1pendulumNumber' );

  /**
   * {Array} pendulumModels - property to control visibility of ruler
   * {Property} numberOfPendulumsProperty - property to control number of pendulums
   * {Object} options for control panel node
   * @constructor
   */
  function PendulumOptionsControlPanelNode( pendulumModels, numberOfPendulumsProperty, options ) {
    var content = new VBox( {spacing: 3} ),
      pendulumSlidersNodeStorage = [],
      currentNumberOfSliders = 0;

    // create sliders for each pendulum
    pendulumModels.forEach( function( pendulumModel, pendulumModelIndex ) {
      pendulumSlidersNodeStorage.push( new VBox( {spacing: 5, children: [
        // length slider
        new PendulumSlidersNode(
          pendulumModel.property( 'length' ),
          pendulumModel.lengthOptions,
          StringUtils.format( pattern_0propertyName_1pendulumNumber, 'Length', (pendulumModelIndex + 1).toString() ),
          pattern_0lengthValue_lengthUnitsMetric,
          pendulumModel.color
        ),

        // mass slider
        new PendulumSlidersNode(
          pendulumModel.property( 'mass' ),
          pendulumModel.massOptions,
          StringUtils.format( pattern_0propertyName_1pendulumNumber, 'Mass', (pendulumModelIndex + 1).toString() ),
          pattern_0massValue_massUnitsMetric,
          pendulumModel.color
        )
      ]} ) );
    } );

    PanelPendulumAbstract.call( this, content, options );

    numberOfPendulumsProperty.link( function( numberOfPendulums ) {
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

  return inherit( PanelPendulumAbstract, PendulumOptionsControlPanelNode );
} );