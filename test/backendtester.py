# -*- coding: utf-8 -*-
import multiplecsvinput as mtable
import pandas as pd

#mtable.nonCLI("/home/royal/Desktop/inputabsol.csv", "/home/royal/Desktop/outputheadless.csv")


df1 = mtable.createTable("/home/royal/Desktop/LLocator-Results-2020-11-08.csv")

# query 2
# 1. straight line trials
# 2. no blocks
# 3. at least twenty strides
# 4. VS > 8.5 (absolute value)
# 5. diffmax pelvis >3 (absolute value)
# 6. sign of diffmaxpelvis same as sign of diffminhead

mtable.filterTable(df1, "Trial", "==", "Straight Line")
#mtable.filterTable(df1, "Blocks", "==", "Null")

mtable.nonCLI1("/home/royal/Desktop/LLocator-Results-2020-11-08.csv", "/home/royal/Desktop/query1output.csv")






#mtable.exportTable(df1, "/home/royal/Desktop/output/tempfiltered.csv")

"""


#dbtestframe = mtable.createTable("/home/royal/Desktop/LLocator-Results-2020-11-08.csv")
#print("dbtestframe LLocator on desktop", dbtestframe)

#outputDf = pd.DataFrame()

mtable.nonCLI2("/home/royal/Desktop/LLocator-Results-2020-11-08.csv", "/home/royal/Desktop/query2output333.csv")
mtable.nonCLI1("/home/royal/Desktop/LLocator-Results-2020-11-08.csv", "/home/royal/Desktop/query1outputtest.csv")
#outputDf = mtable.goQuery1(dbtestframe, outputDf)

#print("output!", outputDf)
"""

"""
can this be a csv or file / file location / data itself as the parameter and not the string itself?
upload file to the form, have the file as a variable or something in the form, read it in directly,
the function takes the file itself (or its data) same way. WHen done, it would return the file / data
back to where the nonCLI function was called and then the function user could format it or do what they 
need with it.

- take filename in function
- perform actions
- outputs to given filename


YOu can use the nonCLI function above (essentially a read_csv wrapper) with any absolute filepath and filename, I think.
If no filepath is given, working directory is assumed. This would be useful for orginzation / security.

"""
#/home/royal/Desktop/inputabsol.csv