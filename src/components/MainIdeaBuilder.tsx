@@
               <PhysicalLogbookCard
                 content={generatedEntry}
                 source={generationSource}
-                onClear={() => setGeneratedEntry(null)}
+                onClear={handleClearView}
               />
             </motion.div>
           )}
