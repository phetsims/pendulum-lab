// Copyright 2002-2014, University of Colorado Boulder

/**
 * Node with sliders for pendulum in 'Pendulum Lab' simulation.
 * Contains length and mass sliders.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumOptionSliderNode = require( 'PENDULUM_LAB/common/view/PendulumOptionSliderNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var lengthString = require( 'string!PENDULUM_LAB/length' );
  var massString = require( 'string!PENDULUM_LAB/mass' );
  var pattern_0lengthValue_lengthUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0lengthValue.lengthUnitsMetric' );
  var pattern_0massValue_massUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0massValue.massUnitsMetric' );
  var pattern_0propertyName_1pendulumNumber = require( 'string!PENDULUM_LAB/pattern.0propertyName.1pendulumNumber' );

  // constants
  var FONT_TITLE = new PhetFont( { size: 12, weight: 'bold' } );
  var SPACING_CONTENT = 5;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {Object} [options] for control panel node
   * @constructor
   */
  function PendulumSlidersNode( pendulumLabModel, options ) {
    var self = this;
    var pendulumSlidersNodeStorage = [];
    var currentNumberOfSliders = 0;

    this.optionSliders = [];
    var content = new VBox( { spacing: SPACING_CONTENT, align: 'center' } );

    // create sliders for each pendulum and put then into storage for further adding
    pendulumLabModel.pendulums.forEach( function( pendulum, pendulumIndex ) {
      // create length slider
      var lengthSlider = new PendulumOptionSliderNode(
        pendulum.lengthProperty,
        pendulum.lengthRange,
        pattern_0lengthValue_lengthUnitsMetric,
        pendulum.color,
        { y: SPACING_CONTENT }
      );
      self.optionSliders.push( lengthSlider );

      // create mass slider
      var massSlider = new PendulumOptionSliderNode(
        pendulum.massProperty,
        pendulum.massRange,
        pattern_0massValue_massUnitsMetric,
        pendulum.color,
        { y: SPACING_CONTENT }
      );
      self.optionSliders.push( massSlider );

      pendulumSlidersNodeStorage.push( new VBox( {
        spacing: SPACING_CONTENT, align: 'left', children: [
          new Node( {
            children: [
              // add length slider label
              new Text( StringUtils.format( pattern_0propertyName_1pendulumNumber, lengthString, (pendulumIndex + 1).toString() ), {
                font: FONT_TITLE,
                fill: pendulum.color
              } ),
              // add length slider
              lengthSlider
            ]
          } ),

          new Node( {
            children: [
              // add mass slider label
              new Text( StringUtils.format( pattern_0propertyName_1pendulumNumber, massString, (pendulumIndex + 1).toString() ), {
                font: FONT_TITLE,
                fill: pendulum.color
              } ),

              // add mass slider
              massSlider
            ]
          } )
        ]
      } ) );
    } );

    // add necessary pendulum sliders
    pendulumLabModel.numberOfPendulumsProperty.link( function( numberOfPendulums ) {
      var numberDifference = currentNumberOfSliders - numberOfPendulums;

      // remove extra sliders
      if ( numberDifference > 0 ) {
        for ( ; numberDifference--; ) {
          content.removeChildWithIndex( pendulumSlidersNodeStorage[ currentNumberOfSliders - numberDifference - 1 ], currentNumberOfSliders - numberDifference - 1 );
          currentNumberOfSliders--;
        }
      }
      // add necessary sliders
      else if ( numberDifference < 0 ) {
        for ( ; numberDifference++; ) {
          content.insertChild( currentNumberOfSliders - numberDifference, pendulumSlidersNodeStorage[ currentNumberOfSliders - numberDifference ] );
          currentNumberOfSliders++;
        }
      }
    } );

    PanelPendulumAbstract.call( this, content, _.extend( { xMargin: 14 }, options ) );
  }

  return inherit( PanelPendulumAbstract, PendulumSlidersNode );
} );