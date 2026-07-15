# API Terms of Service Compliance

## Summary

All three APIs allow commercial use of generated content. No redistribution blockers for our use case (using generated assets in games).

## Gemini (Google)

- **Source:** https://ai.google.dev/gemini-api/terms
- **Commercial use:** Allowed
- **Key clause:** "Google won't claim ownership over that content"
- **Restrictions:** Google may generate similar content for others (no exclusivity). Cannot use to compete with Gemini API.
- **Attribution:** May be required when returned as part of an API call (check CitationMetadata)
- **Our use:** Generating concept images for game assets. Commercial use allowed.

## ElevenLabs

- **Source:** https://elevenlabs.io/terms-of-use
- **Commercial use:** Allowed on paid plans. Free tier is non-commercial only.
- **Key clause:** "You are permitted to use such Output outside of the Services"
- **Restrictions:** Must comply with Prohibited Use Policy. Cannot use for impersonation without consent.
- **Our use:** Generating ambient audio and sound effects. Paid plan required for commercial use.

## Tripo

- **Source:** https://www.tripo3d.ai/blog/explore/ai-generated-3d-models-and-licensing-questions
- **Commercial use:** Allowed
- **Key clause:** "Tripo grants explicit commercial usage rights for the resulting geometry, enabling immediate retail distribution"
- **Restrictions:** License type varies by plan (Personal/Commercial/Redistribution). Commercial plan needed for our use case.
- **Our use:** Generating 3D models for game assets. Commercial plan required.

## Documentation Requirements

For each generated asset, document:
1. Source tool and date
2. License snapshot (link to ToS at time of generation)
3. Modification log (what changes were made)
4. Final license declaration

## Risk Assessment

- **Exclusivity risk:** LOW — generated content may be similar to others', but this is expected for AI-generated assets
- **Redistribution risk:** LOW — we're using assets in games, not reselling raw models
- **Attribution risk:** MEDIUM — some tools may require attribution; check each tool's specific requirements
- **Commercial risk:** NONE — all three APIs allow commercial use on paid plans

## Conclusion

**Safe to proceed** with asset manifest, skill graveyard, and control-run ledger. All three APIs allow commercial use of generated content for our use case.
