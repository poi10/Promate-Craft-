// ===== PromptCraft Engine v1.0 =====
// Complete Backend Logic Implementation

// ===== KNOWLEDGE GRAPH DATABASE =====
const knowledgeGraph = {
    // Clothing Categories
    clothing: {
        tops: {
            casual: ['t-shirt', 'tank top', 'hoodie', 'button-up shirt', 'crop top', 'loose shirt'],
            formal: ['dress shirt', 'blouse', 'evening top'],
            sports: ['sports bra', 'athletic top', 'yoga top'],
            special: ['kimono', 'school uniform shirt', 'clown costume', 'evening gown']
        },
        bottoms: {
            casual: ['jeans', 'shorts', 'pants', 'slacks'],
            formal: ['dress pants', 'skirt', 'plaid skirt'],
            sports: ['yoga pants', 'athletic shorts', 'leggings'],
            special: ['bikini bottom', 'swimsuit']
        }
    },

    // Body Descriptions
    bodyDescriptions: {
        default: ['slim curvy body', 'medium chest', 'fair skin with slight tan']
    },

    // Quality Keywords
    quality: ['masterpiece', 'best quality', 'ultra high quality', 'highres'],

    // States & Conditions
    states: {
        clothing: {
            shirt: ['(open)', '(torn)', '(wet)', '(unbuttoned)', '(pulled up)', '(falling off)', '(ripped)', '(split open)'],
            pants: ['(torn)', '(ripped)', '(split open)', '(pulled down)', '(loose)', '(falling off)'],
            general: ['(no bra)', '(no panties)', '(wet)', '(sweaty)', '(soaked)']
        },
        body: {
            exposure: ['(breasts exposed)', '(areolae visible)', '(nipples visible)', '(crotch exposed)', '(vagina visible)', '(buttocks exposed)'],
            condition: ['(sweaty body)', 'glistening skin', '(beads of sweat)', '(wet body)', '(soaked)']
        }
    },

    // Creatures & Interactions
    creatures: {
        zombie: {
            type: 'non-human',
            interacting_part: ['(rotting hand)', '(zombie hands)', '(decaying arm)'],
            interaction_method: 'grabbing, squeezing'
        },
        octopus: {
            type: 'non-human',
            interacting_part: ['(slimy tentacles)', '(octopus tentacles)'],
            interaction_method: 'wrapping, squeezing'
        },
        ghost: {
            type: 'non-human',
            interacting_part: ['(unseen hand)', '(invisible hand)', '(ghostly hand)'],
            interaction_method: 'grabbing, squeezing'
        },
        mannequin: {
            type: 'non-human',
            interacting_part: ['(mannequin hand)', '(plastic hand)'],
            interaction_method: 'grabbing, squeezing'
        },
        symbiote: {
            type: 'non-human',
            interacting_part: ['(symbiote tendrils)', '(black tendrils)'],
            interaction_method: 'wrapping, squeezing'
        }
    },

    // Camera Angles
    cameraAngles: {
        front: '(front view)',
        back: '(view from behind)',
        side: '(side angle)',
        upskirt: '(low-angle shot)',
        fullbody: '(full body shot)',
        upper: '(upper body shot)',
        lower: '(lower body shot)'
    },

    // Expressions
    expressions: {
        shock: ['(shocked expression)', '(eyes wide with shock)', '(mouth open in shock)'],
        embarrassed: ['(embarrassed expression)', '(face turning red)', '(blushing heavily)'],
        shy: ['(shy expression)', '(blushing)', '(looking away)'],
        terrified: ['(terrified expression)', '(eyes wide with terror)', '(mouth open in a silent scream)'],
        confused: ['(confused expression)', '(puzzled look)']
    },

    // Scenarios Library
    scenarios: {
        fall: {
            trigger: 'fell, falling, tripped',
            action: '(in the middle of falling forward)',
            cause: '(tripped)',
            exposure_chance: 'high'
        },
        pool: {
            trigger: 'pool, swimming, water',
            action: '(just jumped off a diving board)',
            cause: '(impact with water)',
            exposure_chance: 'high'
        },
        gym: {
            trigger: 'gym, exercise, squat',
            action: '(in the middle of doing a squat)',
            cause: '(back seam ripped)',
            exposure_chance: 'high'
        },
        fitting_room: {
            trigger: 'fitting room, changing, dress',
            action: '(in the middle of changing clothes)',
            cause: '(curtain pulled open)',
            exposure_chance: 'high'
        },
        wind: {
            trigger: 'wind, breeze, windy',
            action: '(standing in the wind)',
            cause: '(gust of wind)',
            exposure_chance: 'high'
        }
    }
};

// ===== PARSER & CONCEPT MAPPER =====
class Parser {
    constructor() {
        this.keywords = [];
        this.concepts = [];
        this.flags = {};
    }

    parse(userInput) {
        const lowerInput = userInput.toLowerCase();
        
        // Detect key concepts
        if (lowerInput.includes('فتاة') || lowerInput.includes('girl') || lowerInput.includes('بنت')) {
            this.concepts.push('girl');
        }
        
        if (lowerInput.includes('سقط') || lowerInput.includes('fell') || lowerInput.includes('fall')) {
            this.concepts.push('fall');
            this.flags.scenario = 'fall';
        }
        
        if (lowerInput.includes('متعرق') || lowerInput.includes('sweat') || lowerInput.includes('sweaty')) {
            this.flags.sweaty = true;
        }
        
        if (lowerInput.includes('مسبح') || lowerInput.includes('pool') || lowerInput.includes('swimming')) {
            this.flags.scenario = 'pool';
        }
        
        if (lowerInput.includes('جيم') || lowerInput.includes('gym') || lowerInput.includes('exercise')) {
            this.flags.scenario = 'gym';
        }
        
        if (lowerInput.includes('غرفة قياس') || lowerInput.includes('fitting room') || lowerInput.includes('changing')) {
            this.flags.scenario = 'fitting_room';
        }
        
        if (lowerInput.includes('ريح') || lowerInput.includes('wind') || lowerInput.includes('breeze')) {
            this.flags.scenario = 'wind';
        }
        
        if (lowerInput.includes('صدر') || lowerInput.includes('breast') || lowerInput.includes('chest')) {
            this.flags.focusArea = 'chest';
        }
        
        if (lowerInput.includes('أرداف') || lowerInput.includes('buttocks') || lowerInput.includes('back')) {
            this.flags.focusArea = 'buttocks';
        }
        
        if (lowerInput.includes('جريء') || lowerInput.includes('bold') || lowerInput.includes('daring')) {
            this.flags.boldness = 3;
        } else if (lowerInput.includes('محرج') || lowerInput.includes('embarrassing')) {
            this.flags.embarrassing = true;
        }
        
        if (lowerInput.includes('يد') || lowerInput.includes('hand') || lowerInput.includes('touch')) {
            this.flags.interaction = 'touch';
        }
        
        if (lowerInput.includes('زومبي') || lowerInput.includes('zombie')) {
            this.flags.creature = 'zombie';
        }
        
        if (lowerInput.includes('أخطبوط') || lowerInput.includes('octopus')) {
            this.flags.creature = 'octopus';
        }
        
        if (lowerInput.includes('شبح') || lowerInput.includes('ghost')) {
            this.flags.creature = 'ghost';
        }
        
        if (lowerInput.includes('مانيكان') || lowerInput.includes('mannequin')) {
            this.flags.creature = 'mannequin';
        }
        
        if (lowerInput.includes('تكافلي') || lowerInput.includes('symbiote')) {
            this.flags.creature = 'symbiote';
        }
        
        return {
            concepts: this.concepts,
            flags: this.flags
        };
    }
}

// ===== ADVANCED STYLIST & DEFAULTS ENGINE =====
class StylistEngine {
    constructor() {
        this.userProfile = {
            body: 'slim curvy body',
            chest: 'medium chest',
            skin: 'fair skin with slight tan'
        };
    }

    selectClothing(scenario, focusArea) {
        let topCategory = 'casual';
        let bottomCategory = 'casual';

        if (scenario === 'gym') {
            topCategory = 'sports';
            bottomCategory = 'sports';
        } else if (scenario === 'fitting_room') {
            topCategory = 'formal';
            bottomCategory = 'formal';
        } else if (scenario === 'pool') {
            return {
                top: 'wearing a bikini top',
                bottom: 'wearing a bikini bottom'
            };
        }

        const tops = knowledgeGraph.clothing.tops[topCategory];
        const bottoms = knowledgeGraph.clothing.bottoms[bottomCategory];

        const selectedTop = tops[Math.floor(Math.random() * tops.length)];
        const selectedBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

        return {
            top: `wearing a ${selectedTop}`,
            bottom: `wearing ${selectedBottom}`
        };
    }

    generateDefaults() {
        return [
            'masterpiece',
            'best quality',
            'ultra high quality',
            'highres',
            '1girl',
            `(${this.userProfile.body})`,
            `(${this.userProfile.chest})`
        ];
    }
}

// ===== INFERENTIAL LOGIC ENGINE =====
class InferentialLogicEngine {
    constructor() {
        this.rules = [];
        this.keywords = [];
    }

    applyLogic(flags, clothing) {
        const keywords = [];

        // Goal-Oriented Logic: Determine the main goal
        let goal = 'expose_chest';
        if (flags.focusArea === 'buttocks') {
            goal = 'expose_buttocks';
        }

        // Scenario-Based Logic
        if (flags.scenario === 'fall') {
            keywords.push('(in the middle of falling forward)');
            keywords.push('(tripped)');
            keywords.push('(arms outstretched)');
            
            if (goal === 'expose_chest') {
                keywords.push('(no bra)');
                keywords.push('(shirt falling off)');
                keywords.push('(both breasts exposed)');
                keywords.push('(areolae visible)');
                keywords.push('(nipples visible)');
            }
        }

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
