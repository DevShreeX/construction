// ==================== Interactive 3D Smart Construction House Adapter ====================
// Upgraded from SkillSphere to ConstructionHouse3D
import { ConstructionHouse3D } from '../constructionHouse/ConstructionHouse3D.js';

export class SkillSphere extends ConstructionHouse3D {
  constructor(options = {}) {
    super(options);
  }
}

export { ConstructionHouse3D };
