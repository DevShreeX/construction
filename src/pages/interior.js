// ==================== AI Interior Design & 2D-to-Video Page ====================

export function interiorPage() {
  return `
    <section class="section">
      <div class="container" style="max-width:1050px">
        <div class="text-center animate-in">
          <span class="badge badge-primary" style="margin-bottom:12px"><i class="fas fa-couch"></i> Google Gemini AI Interior & Video Engine</span>
          <h1>AI Interior Designer & 2D Plan-to-Video Generator</h1>
          <p style="margin-top:8px;margin-bottom:28px">Transform 3 wall/construction site photos into photorealistic 3D interior design concepts, or upload a 2D floor plan to synthesize a step-by-step 3D construction & interior video walkthrough.</p>
          
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:32px">
            <span class="badge badge-success" style="padding:6px 14px"><i class="fas fa-wand-magic-sparkles"></i> 3-Wall Photo AI Synthesis</span>
            <span class="badge badge-accent" style="padding:6px 14px"><i class="fas fa-clapperboard"></i> 2D Plan to 3D AI Video</span>
            <span class="badge badge-primary" style="padding:6px 14px"><i class="fas fa-database"></i> Firebase Backend Persisted</span>
          </div>
        </div>

        <!-- ==================== TAB NAVIGATION ==================== -->
        <div class="card card-glass animate-in" style="padding:8px;margin-bottom:28px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button id="tabInteriorBtn" class="btn btn-primary" style="border-radius:var(--radius-md);flex:1;min-width:240px">
            <i class="fas fa-paintbrush"></i> 3-Wall Photo Interior Generator
          </button>
          <button id="tabVideoBtn" class="btn btn-outline" style="border-radius:var(--radius-md);flex:1;min-width:240px">
            <i class="fas fa-video"></i> 2D Plan to AI Construction Video
          </button>
        </div>

        <!-- ==================== FEATURE A: 3-WALL PHOTO INTERIOR GENERATOR ==================== -->
        <div id="interiorSection" class="card animate-in">
          <h3 style="margin-bottom:12px"><i class="fas fa-camera-retro" style="color:var(--primary);margin-right:8px"></i> 3-Wall / Site Photo AI Interior Designer</h3>
          <p class="text-muted" style="margin-bottom:20px;font-size:0.9rem">Upload or capture 3 wall photos of your construction site or raw room to generate automated high-end interior designs, lighting layouts, and material specifications.</p>

          <!-- 3 Wall Photo Upload Slots -->
          <div class="grid grid-3" style="margin-bottom:20px">
            <!-- Wall 1 -->
            <div class="card card-flat" style="text-align:center;padding:16px;border:2px dashed var(--border);position:relative">
              <span class="badge badge-primary" style="position:absolute;top:8px;left:8px;font-size:0.7rem">Wall 1 (North/Front)</span>
              <div id="wallSlot1" style="height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer">
                <i class="fas fa-image" style="font-size:2rem;color:var(--text-muted);margin-bottom:8px"></i>
                <span style="font-size:0.85rem">Upload Wall 1 Photo</span>
                <input type="file" accept="image/*" id="wallInput1" style="display:none">
              </div>
              <img id="wallImg1" style="display:none;width:100%;height:140px;object-fit:cover;border-radius:var(--radius-sm)" alt="Wall 1">
            </div>

            <!-- Wall 2 -->
            <div class="card card-flat" style="text-align:center;padding:16px;border:2px dashed var(--border);position:relative">
              <span class="badge badge-primary" style="position:absolute;top:8px;left:8px;font-size:0.7rem">Wall 2 (East/Right)</span>
              <div id="wallSlot2" style="height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer">
                <i class="fas fa-image" style="font-size:2rem;color:var(--text-muted);margin-bottom:8px"></i>
                <span style="font-size:0.85rem">Upload Wall 2 Photo</span>
                <input type="file" accept="image/*" id="wallInput2" style="display:none">
              </div>
              <img id="wallImg2" style="display:none;width:100%;height:140px;object-fit:cover;border-radius:var(--radius-sm)" alt="Wall 2">
            </div>

            <!-- Wall 3 -->
            <div class="card card-flat" style="text-align:center;padding:16px;border:2px dashed var(--border);position:relative">
              <span class="badge badge-primary" style="position:absolute;top:8px;left:8px;font-size:0.7rem">Wall 3 (South/Left)</span>
              <div id="wallSlot3" style="height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer">
                <i class="fas fa-image" style="font-size:2rem;color:var(--text-muted);margin-bottom:8px"></i>
                <span style="font-size:0.85rem">Upload Wall 3 Photo</span>
                <input type="file" accept="image/*" id="wallInput3" style="display:none">
              </div>
              <img id="wallImg3" style="display:none;width:100%;height:140px;object-fit:cover;border-radius:var(--radius-sm)" alt="Wall 3">
            </div>
          </div>

          <!-- Configuration Controls -->
          <div class="form-row" style="margin-bottom:20px">
            <div class="form-group">
              <label class="form-label">Interior Design Aesthetic Style</label>
              <select class="form-select" id="interiorStyleSelect" required>
                <option value="Modern Minimalist">Modern Minimalist (Sleek LED Cove & Marble)</option>
                <option value="Luxury Scandinavian">Luxury Scandinavian (Warm Oak Slats & Textiles)</option>
                <option value="Industrial Loft">Industrial Loft (Exposed Brick & Matte Steel)</option>
                <option value="Contemporary Executive">Contemporary Executive (Dark Walnut & Brass)</option>
                <option value="Biophilic Green">Biophilic Green (Living Moss Wall & Natural Stone)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Room Purpose / Space Type</label>
              <select class="form-select" id="interiorRoomSelect" required>
                <option value="Living Lounge">Living Lounge / Reception</option>
                <option value="Executive Suite">Executive Master Suite</option>
                <option value="Commercial Office">Commercial Open-Plan Office</option>
                <option value="Kitchen & Dining">Modern Kitchen & Island Dining</option>
                <option value="Showroom Gallery">Luxury Product Showroom</option>
              </select>
            </div>
          </div>

          <button id="generateInteriorBtn" class="btn btn-accent btn-block" style="font-size:1.05rem;padding:14px">
            <i class="fas fa-wand-magic-sparkles"></i> Generate AI Interior Design from 3 Walls
          </button>

          <!-- Generation Loading State -->
          <div id="interiorLoadingState" style="display:none;margin-top:24px;text-align:center;padding:24px;background:rgba(15,23,42,0.8);border-radius:var(--radius-md);border:1px solid var(--accent)">
            <p style="font-size:1.1rem;color:var(--accent);margin-bottom:8px">
              <i class="fas fa-spinner fa-spin" style="margin-right:8px"></i> Synthesizing 3 Wall Spatial Data with Gemini AI...
            </p>
            <p class="text-muted" style="font-size:0.85rem">Applying architectural lighting, wall paneling, and acoustic furniture alignment...</p>
          </div>

          <!-- Generated Interior Renders Output Container -->
          <div id="interiorResultContainer" style="display:none;margin-top:28px">
            <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
              <h4 style="margin:0"><i class="fas fa-sparkles" style="color:var(--gold)"></i> AI Generated Interior Concept Renders</h4>
              <button id="saveInteriorFirebaseBtn" class="btn btn-primary btn-sm">
                <i class="fas fa-cloud-arrow-up"></i> Save Concept to Firebase
              </button>
            </div>

            <!-- Renders Display Grid -->
            <div class="grid grid-2" style="margin-bottom:20px">
              <div class="card card-flat" style="padding:12px">
                <h5 style="margin-bottom:8px;color:var(--primary)"><i class="fas fa-eye"></i> Viewpoint A (North Perspective)</h5>
                <img id="interiorRenderImg1" src="/images/interior_1.png" style="width:100%;height:260px;object-fit:cover;border-radius:var(--radius-md)" alt="Interior Render 1">
              </div>
              <div class="card card-flat" style="padding:12px">
                <h5 style="margin-bottom:8px;color:var(--primary)"><i class="fas fa-eye"></i> Viewpoint B (East/Lighting Angle)</h5>
                <img id="interiorRenderImg2" src="/images/interior_2.png" style="width:100%;height:260px;object-fit:cover;border-radius:var(--radius-md)" alt="Interior Render 2">
              </div>
            </div>

            <!-- AI Specifications Breakdown -->
            <div class="grid grid-3">
              <div class="card card-flat" style="padding:16px">
                <h5 style="color:var(--accent);margin-bottom:10px"><i class="fas fa-layer-group"></i> Materials & Finishes</h5>
                <ul id="interiorMaterialsList" style="font-size:0.85rem;padding-left:18px;margin:0;line-height:1.6">
                  <li>Natural Warm Oak Wall Slats</li>
                  <li>Concealed 3000K Ambient Cove LED</li>
                  <li>Italian Micro-cement Flooring</li>
                  <li>Modular Italian Leather Seating</li>
                </ul>
              </div>
              <div class="card card-flat" style="padding:16px">
                <h5 style="color:var(--gold);margin-bottom:10px"><i class="fas fa-palette"></i> Palette & Lighting</h5>
                <p style="font-size:0.85rem;margin-bottom:8px"><strong>Lighting Scheme:</strong> Direct Task + Indirect Ambient LED</p>
                <div style="display:flex;gap:8px;margin-top:10px">
                  <span style="width:28px;height:28px;border-radius:50%;background:#0f172a;border:1px solid #fff" title="#0f172a Deep Slate"></span>
                  <span style="width:28px;height:28px;border-radius:50%;background:#d97706;border:1px solid #fff" title="#d97706 Warm Amber"></span>
                  <span style="width:28px;height:28px;border-radius:50%;background:#f8fafc;border:1px solid #fff" title="#f8fafc Pure Linen"></span>
                  <span style="width:28px;height:28px;border-radius:50%;background:#334155;border:1px solid #fff" title="#334155 Graphite"></span>
                </div>
              </div>
              <div class="card card-flat" style="padding:16px">
                <h5 style="color:var(--success);margin-bottom:10px"><i class="fas fa-coins"></i> Estimated Turnkey Cost</h5>
                <h3 id="interiorCostText" style="color:var(--success);margin:8px 0">$34,500 – $48,000</h3>
                <p class="text-muted" style="font-size:0.75rem">*Includes architectural wall paneling, lighting fixtures, flooring, and furniture installation.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== FEATURE B: 2D PLAN TO 3D AI VIDEO GENERATOR ==================== -->
        <div id="videoSection" class="card animate-in" style="display:none">
          <h3 style="margin-bottom:12px"><i class="fas fa-film" style="color:var(--accent);margin-right:8px"></i> 2D Implementation Plan to Construction AI Video Generator</h3>
          <p class="text-muted" style="margin-bottom:20px;font-size:0.9rem">Upload a 2D floor plan or architectural layout to generate an automated 3D step-by-step construction build-out video simulation.</p>

          <!-- 2D Plan File Dropzone -->
          <div class="card card-flat" style="text-align:center;padding:24px;border:2px dashed var(--accent);margin-bottom:20px;cursor:pointer" id="planDropzone">
            <i class="fas fa-file-architect" style="font-size:2.8rem;color:var(--accent);margin-bottom:10px"></i>
            <h4 style="margin-bottom:4px">Upload 2D Blueprint / Implementation Plan</h4>
            <p class="text-muted" style="font-size:0.85rem">Drag and drop PNG, JPG, or CAD architectural 2D layout</p>
            <input type="file" accept="image/*" id="planFileInput" style="display:none">
            <div id="planPreviewBox" style="display:none;margin-top:12px">
              <span id="planFileName" class="badge badge-primary">blueprint_layout.png</span>
            </div>
          </div>

          <!-- Video Mode Configuration -->
          <div class="form-row" style="margin-bottom:20px">
            <div class="form-group">
              <label class="form-label">Simulation Video Mode</label>
              <select class="form-select" id="videoModeSelect">
                <option value="Full Construction Sequence">Full Step-by-Step Construction & Interior Sequence (0% to 100%)</option>
                <option value="3D Interior Flythrough">3D Interior Staging Architectural Flythrough</option>
                <option value="Structural Frame Timelapse">Structural Steel & Framing Build Timelapse</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Target Video Quality / FPS</label>
              <select class="form-select">
                <option>4K Ultra HD (60 FPS Cinematic rendering)</option>
                <option>1080p Full HD (30 FPS Standard)</option>
              </select>
            </div>
          </div>

          <button id="generateVideoBtn" class="btn btn-primary btn-block" style="font-size:1.05rem;padding:14px">
            <i class="fas fa-clapperboard"></i> Generate AI Construction Video from 2D Plan
          </button>

          <!-- Video Generation Loading State -->
          <div id="videoLoadingState" style="display:none;margin-top:24px;text-align:center;padding:24px;background:rgba(15,23,42,0.8);border-radius:var(--radius-md);border:1px solid var(--primary)">
            <p style="font-size:1.1rem;color:var(--primary);margin-bottom:8px">
              <i class="fas fa-gear fa-spin" style="margin-right:8px"></i> Parsing 2D Blueprint Vector Grid & Generating 3D AI Video Frames...
            </p>
            <p class="text-muted" style="font-size:0.85rem">Rendering 60 FPS spatial lighting, wall extrusion, and interior furniture animation...</p>
          </div>

          <!-- Interactive AI Construction Video Player -->
          <div id="videoPlayerContainer" style="display:none;margin-top:28px">
            <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:12px">
              <h4 style="margin:0"><i class="fas fa-video" style="color:var(--accent)"></i> 3D Construction & Interior AI Video Simulation</h4>
              <span class="badge badge-success"><i class="fas fa-circle"></i> 4K 60FPS AI Stream</span>
            </div>

            <!-- Canvas Video Generator Viewport -->
            <div style="position:relative;background:#000;border-radius:var(--radius-md);overflow:hidden;border:2px solid var(--accent);box-shadow:0 12px 40px rgba(0,0,0,0.6)">
              <canvas id="constructionVideoCanvas" width="960" height="540" style="width:100%;height:auto;display:block;background:#050914"></canvas>
              
              <!-- Video Overlay Badge -->
              <div style="position:absolute;top:16px;left:16px;background:rgba(0,0,0,0.7);padding:6px 14px;border-radius:var(--radius-sm);color:#fff;font-size:0.8rem;display:flex;align-items:center;gap:8px">
                <span id="videoStageBadge" class="badge badge-accent">Phase: 0% Blueprint Grid</span>
                <span id="videoTimeText">00:00 / 00:15</span>
              </div>
            </div>

            <!-- Video Controls Bar -->
            <div class="card card-flat" style="margin-top:12px;padding:12px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
              <button id="playPauseVideoBtn" class="btn btn-primary btn-sm"><i class="fas fa-play"></i> Play Video</button>
              <button id="restartVideoBtn" class="btn btn-outline btn-sm"><i class="fas fa-rotate-left"></i> Restart</button>
              <input type="range" id="videoScrubber" min="0" max="100" value="0" style="flex:1;cursor:pointer">
              <button id="saveVideoFirebaseBtn" class="btn btn-accent btn-sm"><i class="fas fa-cloud-arrow-up"></i> Save Video to Firebase</button>
            </div>

            <!-- Milestone Build Schedule -->
            <div class="card card-flat" style="margin-top:16px;padding:16px">
              <h5 style="margin-bottom:12px;color:var(--primary)"><i class="fas fa-list-check"></i> Construction Milestone Sequence Breakdown</h5>
              <div class="grid grid-4" style="grid-template-columns:repeat(auto-fit, minmax(160px, 1fr))">
                <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)"><strong style="color:var(--accent)">00:00 - 00:03</strong><br><span style="font-size:0.8rem">2D Plan Vector Analysis</span></div>
                <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)"><strong style="color:var(--accent)">00:04 - 00:07</strong><br><span style="font-size:0.8rem">3D Framing & Drywall</span></div>
                <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)"><strong style="color:var(--accent)">00:08 - 00:11</strong><br><span style="font-size:0.8rem">Lighting & Wall Paneling</span></div>
                <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm)"><strong style="color:var(--success)">00:12 - 00:15</strong><br><span style="font-size:0.8rem">Luxury Interior Staging</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== FIREBASE SAVED PROJECTS SECTION ==================== -->
        <div class="card animate-in delay-1" style="margin-top:32px">
          <div class="flex-between" style="flex-wrap:wrap;gap:12px;margin-bottom:16px">
            <h3><i class="fas fa-database" style="color:var(--accent);margin-right:8px"></i> Firebase Saved AI Interior & Video Projects</h3>
            <button id="refreshInteriorFirebaseBtn" class="btn btn-outline btn-sm"><i class="fas fa-arrows-rotate"></i> Refresh Records</button>
          </div>
          <div id="firebaseInteriorContainer">
            <p class="text-muted" style="font-size:0.9rem">Fetching saved interior design concepts & video plans from Firebase backend...</p>
          </div>
        </div>

      </div>
    </section>`;
}
