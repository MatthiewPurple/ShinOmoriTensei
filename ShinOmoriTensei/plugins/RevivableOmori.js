!function() {

    // If everyone is dead: Game Over
    BattleManager.updateBattleEnd = function() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && $gameParty.isAllDead()) {
            $gameParty.refreshMembers();
            setTimeout(function(){
                $gameScreen.startTint([-255,-255,-255,0], 180);
                if(!!AudioManager._currentBgm && !!AudioManager._bgmBuffer){
                    AudioManager.fadeOutBgm(3);
                }
                SceneManager.goto(Scene_Gameover);
            },500);
        } else {
            SceneManager.pop();
        }
        this._phase = null;
    };

    // "OMORI became TOAST!"
    Yanfly.BEC.Window_BattleLog_displayAddedStates = function(target) {
		target.result().addedStateObjects().forEach(function(state) {
			var stateMsg = target.isActor() ? state.message1 : state.message2;
			if (state.id === target.deathStateId()) {
				this.push('performCollapse', target);
			}
			if(state.id === target.deathStateId() && target.isActor()) {
				if([/*1,*/8,9,10,11].contains(target.actorId())) {
					stateMsg = " blacked out!";
				}
			}
			if (stateMsg) {
				this.push('popBaseLine');
				this.push('pushBaseLine');
				this.push('addText', target.name() + stateMsg);
				this.push('waitForEffect');
			}
		}, this);		
	}

    // TOAST sound effect for OMORI
    Game_Actor.prototype.performCollapse = function() {
		Game_Battler.prototype.performCollapse.call(this);
		if ($gameParty.inBattle() && !this._playedCollapseSound) {
			if(![/*1*/,8].contains(this.actorId())) {SoundManager.playActorCollapse();}
			this._playedCollapseSound = true;
		}
	};

	let old_Sprite_BattleLowHpOverlay_prototype_update = Sprite_BattleLowHpOverlay.prototype.update;
	Sprite_BattleLowHpOverlay.prototype.update = function() {
		this.opacity = 0;
		let members = $gameParty.members();
  
		let member_hp_rates = members.map(member => [member, member.hp/member.mhp])

		member_hp_rates.sort((a, b) => b[1] > a[1])

		this._actor = member_hp_rates[0][0];
		old_Sprite_BattleLowHpOverlay_prototype_update.call(this);			
	  };

}()