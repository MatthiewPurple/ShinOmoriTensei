!function() {
  //Retry option modification
  function NoRetriesMod () {
	if (Snek.ModConfigs.checkConfig('After a Game Over').index == 2){
		StorageManager.remove(DataManager.lastAccessedSavefileId());
	}
  	SceneManager.goto(Scene_OmoriTitleScreen);
  }

	//Had to import the entire function because my modification can't be made in advance
	Scene_Gameover.prototype.updateTransitionAnimation = function() {
		// Get Animation Data
		let anim = this._animData;
		// If Animation is active
		if (anim.active) {
		  // If Animation has Delay
		  if (anim.delay > 0) {
			// Reduce Delay
			anim.delay--
			return;
		  };
		  // Animation Phase Switch Case
		  switch (anim.phase) {
			case 0: // Initial Delay
			  anim.phase = 1;
				anim.delay = 80;
			  if (this._isFinalBattle && this._finalBattlePhase >= 5) {
				AudioManager.playMe({name: 'xx_gameover_piano', volume: 100, pitch: 100, pan:0});
				//AudioManager.playCurrentBGMOnce();
	  
				anim.delay = 500;
	  
			  } else if (!this._isFinalBattle) {
				AudioManager.playMe({name: 'xx_gameover', volume: 100, pitch: 100, pan:0});
				//AudioManager.playCurrentBGMOnce();
	  
			  }
			  break;
			case 1: // Move Up
			if (this._isFinalBattle  && this._finalBattlePhase >= 5) {
			  let centerY = ((Graphics.height - this._omoriSprite.width) / 2) + 74;
			  let speed = 1;
	  
			  if(!this._textModeSettings.waiter) {
				this._textModeSettings.waiter = true;
				anim.delay = 60;
				return;
			  }
	  
			  if(this._textSprite.opacity > 0) {
				this._textSprite.opacity = Math.max(this._textSprite.opacity - speed, 0);
				this._backSprite.opacity -= 16;
			  }
			  else {
				if(!this._textSprite.hasMadeDelay) {
				  anim.delay = 250;
				  this._textSprite.active = false;
				  this._textSprite.hasMadeDelay = true;
				  return;
				}
				this._omoriSprite.opacity += 10;
			  }
	  
			  if (this._omoriSprite.opacity >= 255) {
				anim.phase = 2;
			  }
			} else {
			  if(!this._isInBattle) {
				anim.delay = 400;
				anim.phase = 7
			  }
			  else {anim.phase = 2;}
			  //NO RETRIES MODIFICATION-----------------------------------------------------------------------------------------------------------------------------------------------------------
              if (Snek.ModConfigs.checkConfig('After a Game Over').index != 0){
                setTimeout(NoRetriesMod, 6000); //If we're dead and it's not the scripted death during the last fight, wait 6 seconds and go back to the title screen
                anim.phase = -1; //Also stop all animations
              }
			  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			}
			  break;
			  case 2:
				  this._retryWindows[0].update(anim.phase);
				  this._retryWindows[1].update(anim.phase);
				  if (this._retryWindows[0].opacity >= 255) {
					this._retryCursorSprite.opacity = 255;
					this.updateRetryInputCursorPosition(0);
					anim.phase = 3;
					this._inputData.active = true;
				  }
				break;
			  case 4:
				this._retryWindows[0].update(anim.phase);
				this._retryWindows[1].update(anim.phase);
				this._retryCursorSprite.opacity -= 4;
				this._textSprite.opacity -= 4;
				this._backSprite.opacity -= 4;
				if (this._isFinalBattle  && this._finalBattlePhase >= 5) {
				  this._omoriSprite.opacity -= 4;
				}
	  
				if (this._backSprite.opacity <= 0) {
					anim.phase = 5;
					this.removeAddedChildren();
					BattleManager.processRetry();
				}
				break;
	  
			  case 7:
				this._textSprite.opacity -= 2;
				this._backSprite.opacity -= 2;
				if (this._backSprite.opacity <= 0) {
				  anim.phase = 8;
				}
				break;
	  
			  case 8: // Fadeout
				if (this._fadeDuration <= 0) {
				  // Hide container, prevents popup
				  this.visible = false;
				  // If In Final Battle
				  if (this._isFinalBattle) {
					// Restore Leader to prevent a game over loop
					$gameParty.members()[0].recoverAll();
					this.removeAddedChildren();
					// If In final battle return to map
					SceneManager.goto(Scene_Map);
					// Reset Animation Phase
					anim.phase = -1;
				  } else {
					  this.removeAddedChildren();
					// Go to the title screen
					SceneManager.goto(Scene_OmoriTitleScreen);
					anim.phase = -1;
				  };
				};
			  break;
		  };
		};
	};
	
	yin_gameover_updatetransitionAnimation = Scene_Gameover.prototype.updateTransitionAnimation;
	Scene_Gameover.prototype.updateTransitionAnimation = function() {
		yin_gameover_updatetransitionAnimation.call(this);
		let anim = this._animData;
		switch (anim.phase) {
			case 2:
			case 3:
				this._retryQuestion.update(anim.phase);
				break;
			case 4: 
				this._retryQuestion.update(anim.phase);
				break;
		}
	}
}()