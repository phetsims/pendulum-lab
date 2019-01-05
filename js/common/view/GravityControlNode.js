// Copyright 2014-2018, University of Colorado Boulder

/**
 * Gravity slider and body list node in 'Pendulum lab' simulation.
 * Tweakers can be added using special function.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Body = require( 'PENDULUM_LAB/common/model/Body' );
  var ComboBox = require( 'SUN/ComboBox' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PendulumNumberControl = require( 'PENDULUM_LAB/common/view/PendulumNumberControl' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var gravitationalAccelerationPatternString = require( 'string!PENDULUM_LAB/gravitationalAccelerationPattern' );
  var gravityString = require( 'string!PENDULUM_LAB/gravity' );
  var lotsString = require( 'string!PENDULUM_LAB/lots' );
  var noneString = require( 'string!PENDULUM_LAB/none' );
  var whatIsTheValueOfGravityString = require( 'string!PENDULUM_LAB/whatIsTheValueOfGravity' );

  /**
   * @constructor
   *
   * @param {Property.<number>} gravityProperty - Property to update by slider.
   * @param {Range} gravityRange - Range of gravity property.
   * @param {Property.<Body>} bodyProperty - Property to update by combo box.
   * @param {Node} popupLayer
   * @param {Object} [options]
   */
  function GravityControlNode( gravityProperty, gravityRange, bodyProperty, popupLayer, options ) {
    options = _.extend( {
      useTextSliderLabels: true
    }, options );

    var labelPattern = StringUtils.fillIn( gravitationalAccelerationPatternString, {
      gravity: '{0}'
    } );

    var comboBoxItems = Body.BODIES.map( function( body ) {
      return ComboBox.createItem( new Text( body.title, {
          font: PendulumLabConstants.GRAVITY_COMBO_FONT,
          maxWidth: 50
        } ), body );
    } );

    var comboBox = new ComboBox( comboBoxItems, bodyProperty, popupLayer, {
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 3
    } );

    var questionText = new Text( whatIsTheValueOfGravityString, { font: PendulumLabConstants.VALUE_OF_GRAVITY_FONT } );

    bodyProperty.link( function( body ) {
      questionText.visible = body === Body.PLANET_X;
    } );

    var numberControl = new PendulumNumberControl( gravityString, gravityProperty, gravityRange, labelPattern, 'rgb(50,145,184)', {
      hasReadoutProperty: new DerivedProperty( [ bodyProperty ], function( body ) {
        return !options.useTextSliderLabels && body !== Body.PLANET_X;
      } ),
      minTick: options.useTextSliderLabels ? noneString : null,
      maxTick: options.useTextSliderLabels ? lotsString : null,
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: '#71EDFF',
      createBottomContent: function( bottomBox ) {

        // Supports Pendulum Lab's questionText where a question is substituted for the slider
        var bottomContent = new Node( {
          children: [
            bottomBox,
            questionText
          ]
        } );
        questionText.maxWidth = bottomBox.width;
        questionText.center = bottomBox.center;
        questionText.onStatic( 'visibility', function() {
          bottomBox.visible = !questionText.visible;
        } );

        return bottomContent;
      },
      excludeTweakers: options.useTextSliderLabels,
      sliderPadding: options.useTextSliderLabels ? 14 : 0,
      // See https://github.com/phetsims/pendulum-lab/issues/183 for rounding
      constrainValue: function( value ) {
        return Util.roundSymmetric( value * 2 ) / 2;
      }
    } );

    VBox.call( this, _.extend( {
      spacing: 5,
      children: [ numberControl, comboBox ]
    }, options ) );
  }

  pendulumLab.register( 'GravityControlNode', GravityControlNode );

  return inherit( VBox, GravityControlNode );
} );
