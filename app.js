        if (flags.scenario === 'pool') {
            keywords.push('(just jumped off a diving board)');
            keywords.push('in a swimming pool');
            keywords.push('(splashing water)');
            keywords.push('(impact with water knocked bikini off)');
            keywords.push('(completely nude)');
            keywords.push('(both breasts exposed)');
            keywords.push('(areolae visible)');
            keywords.push('(nipples visible)');
            keywords.push('(crotch exposed)');
            keywords.push('(vagina visible)');
        }

        if (flags.scenario === 'gym') {
            keywords.push('in a gym');
            keywords.push('(in the middle of doing a squat)');
            keywords.push('(no panties)');
            keywords.push('(back seam of pants ripped open)');
            keywords.push('(buttocks completely exposed)');
            keywords.push('(crotch exposed from behind)');
            keywords.push('(vagina visible from behind)');
        }

        if (flags.scenario === 'fitting_room') {
            keywords.push('in a fitting room');
            keywords.push('(in the middle of changing clothes)');
            keywords.push('(curtain suddenly pulled open)');
            keywords.push('(completely nude)');
            keywords.push('(both breasts exposed)');
            keywords.push('(areolae visible)');
            keywords.push('(nipples visible)');
            keywords.push('(crotch exposed)');
            keywords.push('(vagina visible)');
        }

        if (flags.scenario === 'wind') {
            keywords.push('(standing in the wind)');
            keywords.push('(gust of wind)');
            keywords.push('(dress blown up)');
            keywords.push('(no panties)');
            keywords.push('(crotch exposed)');
            keywords.push('(vagina visible)');
        }

        // Creature Interaction Logic
        if (flags.creature && flags.interaction) {
            const creature = knowledgeGraph.creatures[flags.creature];
            if (creature) {
                const part = creature.interacting_part[Math.floor(Math.random() * creature.interacting_part.length)];
                keywords.push(part);
                keywords.push('(grabbing her breast)');
                keywords.push('(squeezing her breast)');
                
                // Goal-Oriented: If touching chest, expose it
                if (goal === 'expose_chest') {
                    keywords.push('(no bra)');
                    keywords.push('(buttons popping off)');
                    keywords.push('(shirt bursting open)');
                    keywords.push('(both breasts exposed)');
                    keywords.push('(areolae visible)');
                    keywords.push('(nipples visible)');
                }
            }
        }

        // Sweaty Body Logic
        if (flags.sweaty) {
            keywords.push('(sweaty body)');
            keywords.push('glistening skin');
            keywords.push('(beads of sweat)');
        }

        // Embarrassment Logic
        if (flags.embarrassing) {
            keywords.push('(embarrassed expression)');
            keywords.push('(face turning red)');
            keywords.push('(blushing heavily)');
        }

        return keywords;
    }
}

// ===== VIRTUAL CINEMATOGRAPHER =====
class VirtualCinematographer {
    determineCameraAngle(focusArea) {
        if (focusArea === 'buttocks') {
            return '(view from behind)';
        } else if (focusArea === 'chest') {
            return '(front view)';
        } else {
            return '(side angle)';
        }
    }

    determineShotType(focusArea) {
        if (focusArea === 'chest') {
            return '(upper body shot)';
        } else if (focusArea === 'buttocks') {
            return '(lower body shot)';
        } else {
            return '(full body shot)';
        }
    }

    determineFocus(focusArea) {
        if (focusArea === 'chest') {
            return '(focus on chest)';
        } else if (focusArea === 'buttocks') {
            return '(focus on buttocks)';
        } else {
            return '';
        }
    }

    removeContradictions(keywords, cameraAngle) {
        // If viewing from behind, remove face descriptions
        if (cameraAngle === '(view from behind)') {
            return keywords.filter(k => 
                !k.includes('expression') && 
                !k.includes('face') && 
                !k.includes('eyes') &&
                !k.includes('mouth')
            );
        }
        return keywords;
    }

    atomicPurification(keywords) {
        // Remove redundant long phrases and keep only atomic keywords
        const atomic = [];
        keywords.forEach(k => {
            // Split long phrases into atomic parts
            if (k.includes('and')) {
                const parts = k.split(' and ');
                parts.forEach(p => atomic.push(p.trim()));
            } else {
                atomic.push(k);
            }
        });
        return atomic;
    }
}

// ===== SAFETY MODULE =====
class SafetyModule {
    checkSafety(flags) {
        // Reject human-on-human violence
        if (flags.humanAggressor && flags.victim) {
            return {
                safe: false,
                message: 'لا يمكن معالجة هذا الطلب - يتضمن عنفًا بين البشر'
            };
        }
        return { safe: true };
    }
}

// ===== MAIN PROMPTCRAFT ENGINE =====
class PromptCraftEngine {
    constructor() {
        this.parser = new Parser();
        this.stylist = new StylistEngine();
        this.logic = new InferentialLogicEngine();
        this.cinematographer = new VirtualCinematographer();
        this.safety = new SafetyModule();
    }

    generate(userInput) {
        try {
            // Step 1: Parse
            const parsed = this.parser.parse(userInput);
            
            // Step 2: Safety Check
            const safetyCheck = this.safety.checkSafety(parsed.flags);
            if (!safetyCheck.safe) {
                return safetyCheck.message;
            }

            // Step 3: Generate Defaults
            let keywords = this.stylist.generateDefaults();

            // Step 4: Select Clothing
            const clothing = this.stylist.selectClothing(
                parsed.flags.scenario || 'casual',
                parsed.flags.focusArea || 'chest'
            );
            keywords.push(clothing.top);
            keywords.push(clothing.bottom);

            // Step 5: Apply Logic
            const logicKeywords = this.logic.applyLogic(parsed.flags, clothing);
            keywords = keywords.concat(logicKeywords);

            // Step 6: Determine Camera
            const cameraAngle = this.cinematographer.determineCameraAngle(parsed.flags.focusArea);
            const shotType = this.cinematographer.determineShotType(parsed.flags.focusArea);
            const focus = this.cinematographer.determineFocus(parsed.flags.focusArea);

            // Step 7: Remove Contradictions
            keywords = this.cinematographer.removeContradictions(keywords, cameraAngle);

            // Step 8: Add Camera Keywords
            keywords.push(cameraAngle);
            keywords.push(shotType);
            if (focus) keywords.push(focus);

            // Step 9: Add Background
            keywords.push('white background');

            // Step 10: Atomic Purification
            keywords = this.cinematographer.atomicPurification(keywords);

            // Step 11: Remove Duplicates and Empty Strings
            keywords = [...new Set(keywords)].filter(k => k.trim() !== '');

            // Step 12: Final Assembly
            const finalPrompt = keywords.join(', ');

            return finalPrompt;
        } catch (error) {
            return `خطأ: ${error.message}`;
        }
    }
}

// ===== UI INTERACTION =====
const engine = new PromptCraftEngine();

document.getElementById('generateBtn').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value.trim();
    
    if (!userInput) {
        showError('يرجى إدخال نصًا أولاً');
        return;
    }

    const output = engine.generate(userInput);
    document.getElementById('outputPrompt').value = output;
    showSuccess('تم إنشاء الموجه بنجاح!');
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const outputText = document.getElementById('outputPrompt').value;
    
    if (!outputText) {
        showError('لا يوجد موجه لنسخه');
        return;
    }

    navigator.clipboard.writeText(outputText).then(() => {
        showSuccess('تم نسخ الموجه إلى الحافظة!');
    }).catch(() => {
        showError('فشل النسخ. حاول يدويًا.');
    });
});

function showError(message) {
    const errorDiv = document.querySelector('.error-message') || createMessageDiv('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    setTimeout(() => errorDiv.classList.remove('active'), 3000);
}

function showSuccess(message) {
    const successDiv = document.querySelector('.success-message') || createMessageDiv('success-message');
    successDiv.textContent = message;
    successDiv.classList.add('active');
    setTimeout(() => successDiv.classList.remove('active'), 3000);
}

function createMessageDiv(className) {
    const div = document.createElement('div');
    div.className = className;
    document.querySelector('main').insertBefore(div, document.querySelector('.input-section'));
    return div;
}
